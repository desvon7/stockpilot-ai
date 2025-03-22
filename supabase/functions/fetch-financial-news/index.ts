
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { getNewsFromCache, saveNewsToCache } from "./utils/cache.ts";
import { fetchAlphaVantageNews } from "./sources/alphaVantage.ts";
import { fetchFinnhubNews } from "./sources/finnhub.ts";
import { fetchNewsApi } from "./sources/newsApi.ts";
import { fetchFallbackNews } from "./sources/fallback.ts";
import { filterNewsByCategories } from "./utils/filters.ts";
import { NewsItem } from "./types.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request for financial news');
    const { symbols, categories } = await req.json();
    
    if (!symbols || !Array.isArray(symbols)) {
      throw new Error('Invalid or missing symbols array');
    }

    console.log(`Requested news for symbols: ${symbols.join(', ')}`);
    if (categories) {
      console.log(`With categories: ${categories.join(', ')}`);
    }
    
    // Check cache first
    const cachedNews = await getNewsFromCache(symbols, categories);
    if (cachedNews && cachedNews.length > 0) {
      console.log('Returning cached news');
      
      return new Response(JSON.stringify({ 
        news: cachedNews,
        source: 'cache'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a comma-separated list of symbols for API calls
    const tickers = symbols.join(',');
    let news: NewsItem[] = [];
    let dataSource = '';
    
    // Try each news source in sequence until we get some news
    if (news.length === 0) {
      news = await fetchAlphaVantageNews(tickers);
      if (news.length > 0) dataSource = 'Alpha Vantage';
    }
    
    if (news.length === 0) {
      news = await fetchFinnhubNews(symbols);
      if (news.length > 0) dataSource = 'Finnhub';
    }
    
    if (news.length === 0) {
      news = await fetchNewsApi(symbols);
      if (news.length > 0) dataSource = 'News API';
    }
    
    // Last resort - try to get any financial news if specific news failed
    if (news.length === 0) {
      console.log('No specific news found, trying fallback news');
      news = await fetchFallbackNews();
      if (news.length > 0) dataSource = 'Fallback';
    }
    
    // Filter by categories if specified
    if (categories && categories.length > 0 && news.length > 0) {
      news = filterNewsByCategories(news, categories);
    }
    
    // Sort by publishedAt date (newest first)
    news = news.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    console.log(`Returning ${news.length} news articles from ${dataSource}`);
    
    // Save to cache for future use
    if (news.length > 0) {
      await saveNewsToCache(news, symbols, categories);
    }
    
    return new Response(JSON.stringify({ 
      news,
      source: dataSource
    }), {
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
