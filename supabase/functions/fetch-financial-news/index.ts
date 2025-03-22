
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock news data to use as fallback
const generateMockNews = (symbols) => {
  const companies = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com, Inc.',
    'TSLA': 'Tesla, Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms, Inc.',
    'NFLX': 'Netflix, Inc.',
  };

  const headlines = [
    {
      template: "[COMPANY] Reports Strong Quarterly Earnings, Beats Expectations",
      summary: "[COMPANY] exceeded analyst predictions with strong revenue growth across all segments. The company reported a [PERCENT]% increase in earnings per share compared to the same period last year.",
      sentiment: 0.75
    },
    {
      template: "[COMPANY] Announces New Product Line, Shares Jump",
      summary: "[COMPANY] unveiled its latest product lineup today, impressing analysts and consumers alike. The announcement led to a [PERCENT]% increase in share price.",
      sentiment: 0.82
    },
    {
      template: "[COMPANY] Expands Operations in Emerging Markets",
      summary: "[COMPANY] is investing heavily in expanding its presence in key emerging markets, with a particular focus on Southeast Asia and India. Analysts project this could add [PERCENT]% to annual revenue within three years.",
      sentiment: 0.68
    },
    {
      template: "Analysts Upgrade [COMPANY] Stock to 'Buy' Rating",
      summary: "Several major investment firms have upgraded [COMPANY] to a 'Buy' rating, citing strong fundamentals and growth prospects. Price targets were increased by an average of [PERCENT]%.",
      sentiment: 0.71
    },
    {
      template: "[COMPANY] Announces Major AI Initiative",
      summary: "[COMPANY] is ramping up its artificial intelligence capabilities with a new [PERCENT] billion dollar investment over the next five years. The company aims to integrate AI across its entire product ecosystem.",
      sentiment: 0.65
    },
    {
      template: "[COMPANY] Partners with Leading Tech Firms on Innovation",
      summary: "[COMPANY] has formed strategic partnerships with several leading technology companies to accelerate innovation in [SECTOR]. The collaboration is expected to yield new products within [PERCENT] months.",
      sentiment: 0.58
    }
  ];

  const sectors = {
    'AAPL': 'consumer electronics',
    'MSFT': 'cloud computing',
    'GOOGL': 'digital advertising',
    'AMZN': 'e-commerce',
    'TSLA': 'electric vehicles',
    'NVDA': 'semiconductors',
    'META': 'social media',
    'NFLX': 'streaming media',
  };

  const sources = ['Bloomberg', 'CNBC', 'Reuters', 'Financial Times', 'Wall Street Journal', 'MarketWatch'];
  
  let mockNews = [];
  
  // Generate 3-5 news items for each symbol
  symbols.forEach(symbol => {
    const companyName = companies[symbol] || `${symbol} Corporation`;
    const sector = sectors[symbol] || 'technology';
    
    // Get 3-5 random headlines
    const numArticles = Math.floor(Math.random() * 3) + 3; // 3-5 articles
    const shuffledHeadlines = [...headlines].sort(() => 0.5 - Math.random()).slice(0, numArticles);
    
    shuffledHeadlines.forEach((headline, index) => {
      const percent = Math.floor(Math.random() * 20) + 5; // 5-25%
      const source = sources[Math.floor(Math.random() * sources.length)];
      const daysAgo = index; // 0, 1, 2, etc. days ago
      
      const title = headline.template.replace('[COMPANY]', companyName);
      const summary = headline.summary
        .replace('[COMPANY]', companyName)
        .replace('[PERCENT]', percent.toString())
        .replace('[SECTOR]', sector);
      
      mockNews.push({
        id: `${symbol}-${index}-${Date.now()}`,
        title: title,
        url: `https://finance.example.com/${symbol.toLowerCase()}/news`,
        source: source,
        summary: summary,
        image_url: null,
        published_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
        sentiment: headline.sentiment + (Math.random() * 0.2 - 0.1), // Add some randomness
        symbols: [symbol]
      });
    });
  });
  
  // Sort by published date (newest first)
  return mockNews.sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols, categories } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      throw new Error('Invalid or missing symbols array');
    }

    // Determine if we should use real API or mock data
    const useRealAPI = ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY.length > 5;

    // Create a comma-separated list of symbols
    const tickers = symbols.join(',');
    
    let news = [];
    
    if (useRealAPI) {
      // Fetch news from Alpha Vantage
      console.log(`Fetching news for symbols: ${tickers}`);
      
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${ALPHA_VANTAGE_API_KEY}`,
          { signal: AbortSignal.timeout(10000) } // 10 second timeout
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Alpha Vantage API error:', errorText);
          throw new Error(`Alpha Vantage API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.feed && data.feed.length > 0) {
          news = data.feed.map(item => ({
            id: item.title.replace(/\s+/g, '-').toLowerCase() + '-' + new Date(item.time_published).getTime(),
            title: item.title,
            url: item.url,
            source: item.source,
            summary: item.summary,
            image_url: item.banner_image || null,
            published_at: item.time_published,
            sentiment: item.overall_sentiment_score,
            symbols: item.ticker_sentiment
              ? item.ticker_sentiment.map(ticker => ticker.ticker)
              : []
          }));
        } else {
          console.log('No news found in API response, using mock data');
          throw new Error('No news in API response');
        }
      } catch (apiError) {
        console.error('Error fetching from Alpha Vantage:', apiError);
        // Fall back to mock data
        news = generateMockNews(symbols);
      }
    } else {
      console.log('No API key or invalid API key, using mock data');
      news = generateMockNews(symbols);
    }
    
    // Filter by categories if specified
    if (categories && categories.length > 0) {
      // This is a simplified implementation - in a real app, you might
      // use NLP or the topics field to better categorize news
      news = news.filter(article => {
        // Check if any category keywords appear in the title or summary
        return categories.some(category => 
          article.title.toLowerCase().includes(category.toLowerCase()) ||
          article.summary.toLowerCase().includes(category.toLowerCase())
        );
      });
    }
    
    console.log(`Returning ${news.length} news articles`);
    
    return new Response(JSON.stringify({ news }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-financial-news function:', error);
    
    // Generate fallback news using the mock data generator
    let fallbackNews = [];
    try {
      const { symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'] } = await req.json();
      fallbackNews = generateMockNews(symbols);
      console.log(`Generated ${fallbackNews.length} fallback news items`);
    } catch (fallbackError) {
      console.error('Error generating fallback news:', fallbackError);
      fallbackNews = generateMockNews(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']);
    }
    
    return new Response(JSON.stringify({ 
      news: fallbackNews,
      error: error.message
    }), {
      status: 200, // Return 200 even for errors, with fallback data
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
