
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');

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
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      throw new Error('Invalid or missing symbols array');
    }

    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Create a comma-separated list of symbols
    const tickers = symbols.join(',');
    
    // Fetch news from Alpha Vantage
    console.log(`Fetching news for symbols: ${tickers}`);
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Alpha Vantage API error:', errorText);
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and filter news articles
    let news = [];
    
    if (data.feed) {
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
    }
    
    console.log(`Fetched ${news.length} news articles`);
    
    return new Response(JSON.stringify({ news }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-financial-news function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
