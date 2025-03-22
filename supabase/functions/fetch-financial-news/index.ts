
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
const FINN_HUB_API_KEY = Deno.env.get('FINN_HUB_API_KEY');
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define news item type
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  symbols?: string[];
  sentiment?: number;
}

// Try to fetch news from Alpha Vantage API
async function fetchAlphaVantageNews(tickers: string): Promise<NewsItem[]> {
  if (!ALPHA_VANTAGE_API_KEY) {
    console.log('Alpha Vantage API key not configured');
    return [];
  }

  try {
    console.log(`Fetching Alpha Vantage news for symbols: ${tickers}`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      { signal: AbortSignal.timeout(10000) } // 10 second timeout
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.feed || data.feed.length === 0) {
      console.log('No news found from Alpha Vantage');
      return [];
    }
    
    const news = data.feed.map((item: any) => ({
      id: item.title.replace(/\s+/g, '-').toLowerCase() + '-' + new Date(item.time_published).getTime(),
      title: item.title,
      url: item.url,
      source: item.source,
      summary: item.summary,
      imageUrl: item.banner_image || null,
      publishedAt: item.time_published,
      sentiment: item.overall_sentiment_score,
      symbols: item.ticker_sentiment
        ? item.ticker_sentiment.map((ticker: any) => ticker.ticker)
        : []
    }));
    
    console.log(`Found ${news.length} articles from Alpha Vantage`);
    return news;
  } catch (alphaError) {
    console.error('Error with Alpha Vantage API:', alphaError);
    return [];
  }
}

// Try to fetch news from Finnhub API
async function fetchFinnhubNews(symbols: string[]): Promise<NewsItem[]> {
  if (!FINN_HUB_API_KEY) {
    console.log('Finnhub API key not configured');
    return [];
  }

  try {
    console.log(`Fetching Finnhub news for symbols: ${symbols.join(',')}`);
    // Get date range for past month
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const fromDate = oneMonthAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // Finnhub requires separate requests for each symbol
    const newsPromises = symbols.map(async (symbol) => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${FINN_HUB_API_KEY}`,
          { signal: AbortSignal.timeout(5000) }
        );
        
        if (!response.ok) {
          throw new Error(`Finnhub API returned ${response.status}: ${response.statusText}`);
        }
        
        const items = await response.json();
        return items.map((item: any) => ({
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
      } catch (error) {
        console.error(`Error fetching Finnhub news for ${symbol}:`, error);
        return [];
      }
    });
    
    const allNews = await Promise.all(newsPromises);
    const news = allNews.flat().filter(Boolean);
    
    console.log(`Found ${news.length} articles from Finnhub`);
    return news;
  } catch (finnhubError) {
    console.error('Error with Finnhub API:', finnhubError);
    return [];
  }
}

// Build a query for NewsAPI based on symbols
function buildNewsApiQuery(symbols: string[]): string {
  if (!symbols || symbols.length === 0) {
    return 'financial markets stocks investing';
  }
  
  // Map of stock symbols to company names
  const companyMap: Record<string, string> = {
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
  const query = symbols.map(s => {
    if (companyMap[s]) {
      return `(${s} OR ${companyMap[s]})`;
    }
    return s;
  }).join(' OR ');
  
  // Add financial terms to improve relevance
  return `(${query}) AND (stock OR market OR financial OR earnings OR investor)`;
}

// Try to fetch news from NewsAPI
async function fetchNewsApi(symbols: string[]): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    console.log('NewsAPI key not configured');
    return [];
  }

  try {
    console.log('Fetching news from NewsAPI');
    const query = buildNewsApiQuery(symbols);
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${NEWS_API_KEY}`,
      { signal: AbortSignal.timeout(8000) }
    );
    
    if (!response.ok) {
      throw new Error(`NewsAPI returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.log('No news found from NewsAPI');
      return [];
    }
    
    // Map of stock symbols to company names (used for relevance checking)
    const companyMap: Record<string, string> = {
      'AAPL': 'Apple',
      'MSFT': 'Microsoft',
      'GOOGL': 'Google Alphabet',
      'AMZN': 'Amazon',
      'TSLA': 'Tesla',
      'META': 'Meta Facebook',
      'NVDA': 'NVIDIA',
      'JPM': 'JPMorgan'
    };
    
    const news = data.articles.map((item: any, index: number) => {
      // Extract relevant symbols from the article
      const articleSymbols = symbols.filter(symbol => 
        item.title?.includes(symbol) || 
        item.description?.includes(symbol) || 
        (companyMap[symbol] && 
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
    return news;
  } catch (newsApiError) {
    console.error('Error with NewsAPI:', newsApiError);
    return [];
  }
}

// Filter news by categories if specified
function filterNewsByCategories(news: NewsItem[], categories?: string[]): NewsItem[] {
  if (!categories || categories.length === 0) {
    return news;
  }
  
  return news.filter(article => {
    return categories.some(category => 
      article.title.toLowerCase().includes(category.toLowerCase()) ||
      article.summary.toLowerCase().includes(category.toLowerCase())
    );
  });
}

// Main request handler
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
    let news: NewsItem[] = [];
    
    // Try each news source in sequence until we get some news
    if (news.length === 0) {
      news = await fetchAlphaVantageNews(tickers);
    }
    
    if (news.length === 0) {
      news = await fetchFinnhubNews(symbols);
    }
    
    if (news.length === 0) {
      news = await fetchNewsApi(symbols);
    }
    
    // Filter by categories if specified
    if (categories && categories.length > 0 && news.length > 0) {
      news = filterNewsByCategories(news, categories);
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
