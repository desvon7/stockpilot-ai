
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
const FINN_HUB_API_KEY = Deno.env.get('FINN_HUB_API_KEY');
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols, categories } = await req.json();
    
    if (!symbols || !Array.isArray(symbols)) {
      throw new Error('Invalid or missing symbols array');
    }

    // Create a comma-separated list of symbols for API calls
    const tickers = symbols.join(',');
    let news = [];
    
    // Try Alpha Vantage first (most comprehensive financial news)
    if (ALPHA_VANTAGE_API_KEY) {
      try {
        console.log(`Fetching Alpha Vantage news for symbols: ${tickers}`);
        const response = await fetch(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${ALPHA_VANTAGE_API_KEY}`,
          { signal: AbortSignal.timeout(10000) } // 10 second timeout
        );

        if (response.ok) {
          const data = await response.json();
          
          if (data.feed && data.feed.length > 0) {
            news = data.feed.map(item => ({
              id: item.title.replace(/\s+/g, '-').toLowerCase() + '-' + new Date(item.time_published).getTime(),
              title: item.title,
              url: item.url,
              source: item.source,
              summary: item.summary,
              imageUrl: item.banner_image || null,
              publishedAt: item.time_published,
              sentiment: item.overall_sentiment_score,
              symbols: item.ticker_sentiment
                ? item.ticker_sentiment.map(ticker => ticker.ticker)
                : []
            }));
            
            console.log(`Found ${news.length} articles from Alpha Vantage`);
          }
        }
      } catch (alphaError) {
        console.error('Error with Alpha Vantage API:', alphaError);
        // Continue to the next provider if Alpha Vantage fails
      }
    }
    
    // If Alpha Vantage didn't return any news, try Finnhub
    if (news.length === 0 && FINN_HUB_API_KEY) {
      try {
        console.log(`Fetching Finnhub news for symbols: ${symbols.join(',')}`);
        // Finnhub requires separate requests for each symbol
        const newsPromises = symbols.map(async (symbol) => {
          const today = new Date();
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(today.getMonth() - 1);
          
          const fromDate = oneMonthAgo.toISOString().split('T')[0];
          const toDate = today.toISOString().split('T')[0];
          
          const response = await fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${FINN_HUB_API_KEY}`,
            { signal: AbortSignal.timeout(5000) }
          );
          
          if (response.ok) {
            const items = await response.json();
            return items.map(item => ({
              id: `${item.id || item.headline.replace(/\s+/g, '-').toLowerCase() + '-' + new Date(item.datetime * 1000).getTime()}`,
              title: item.headline,
              summary: item.summary,
              source: item.source,
              publishedAt: new Date(item.datetime * 1000).toISOString(),
              url: item.url,
              imageUrl: item.image,
              symbols: [symbol],
              sentiment: item.sentiment
            }));
          }
          return [];
        });
        
        const allNews = await Promise.all(newsPromises);
        news = allNews.flat().filter(Boolean);
        
        console.log(`Found ${news.length} articles from Finnhub`);
      } catch (finnhubError) {
        console.error('Error with Finnhub API:', finnhubError);
        // Continue to the next provider if Finnhub fails
      }
    }
    
    // If still no news, try NewsAPI as a last resort
    if (news.length === 0 && NEWS_API_KEY) {
      try {
        console.log('Fetching news from NewsAPI');
        let query = '';
        
        // Build a query with company names and stock symbols
        if (symbols && symbols.length > 0) {
          // Convert stock symbols to query terms (e.g., "AAPL" to "Apple")
          const companyMap = {
            'AAPL': 'Apple',
            'MSFT': 'Microsoft',
            'GOOGL': 'Google Alphabet',
            'AMZN': 'Amazon',
            'TSLA': 'Tesla',
            'META': 'Meta Facebook',
            'NVDA': 'NVIDIA',
            'JPM': 'JPMorgan'
          };
          
          // Build query with both symbols and company names
          query = symbols.map(s => {
            if (companyMap[s]) {
              return `(${s} OR ${companyMap[s]})`;
            }
            return s;
          }).join(' OR ');
          
          // Add financial terms to improve relevance
          query = `(${query}) AND (stock OR market OR financial OR earnings OR investor)`;
        } else {
          // Default query for general financial news
          query = 'financial markets stocks investing';
        }
        
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${NEWS_API_KEY}`,
          { signal: AbortSignal.timeout(8000) }
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.articles && data.articles.length > 0) {
            news = data.articles.map((item, index) => {
              // Extract relevant symbols from the article
              const articleSymbols = symbols.filter(symbol => 
                item.title?.includes(symbol) || 
                item.description?.includes(symbol) || 
                (companyMap && companyMap[symbol] && 
                  (item.title?.includes(companyMap[symbol]) || 
                   item.description?.includes(companyMap[symbol])))
              );
              
              return {
                id: `news-api-${index}-${new Date(item.publishedAt).getTime()}`,
                title: item.title,
                summary: item.description || item.content,
                source: item.source.name,
                publishedAt: item.publishedAt,
                url: item.url,
                imageUrl: item.urlToImage,
                symbols: articleSymbols.length > 0 ? articleSymbols : symbols,
                sentiment: null // NewsAPI doesn't provide sentiment
              };
            });
            
            console.log(`Found ${news.length} articles from NewsAPI`);
          }
        }
      } catch (newsApiError) {
        console.error('Error with NewsAPI:', newsApiError);
      }
    }
    
    // Filter by categories if specified
    if (categories && categories.length > 0 && news.length > 0) {
      news = news.filter(article => {
        return categories.some(category => 
          article.title.toLowerCase().includes(category.toLowerCase()) ||
          article.summary.toLowerCase().includes(category.toLowerCase())
        );
      });
    }
    
    // Sort by publishedAt date (newest first)
    news = news.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    console.log(`Returning ${news.length} news articles`);
    
    return new Response(JSON.stringify({ news }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-financial-news function:', error);
    
    return new Response(JSON.stringify({ 
      news: [],
      error: error.message
    }), {
      status: 200, // Return 200 even for errors, with empty array
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
