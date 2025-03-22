
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
      console.log(`Returning ${cachedNews.length} cached news items`);
      
      // Apply category filtering even to cached news to ensure freshness
      let filteredCachedNews = cachedNews;
      if (categories && categories.length > 0) {
        console.log('Filtering cached news by categories');
        filteredCachedNews = filterNewsByCategories(cachedNews, categories);
        console.log(`After filtering: ${filteredCachedNews.length} cached news items`);
      }
      
      return new Response(JSON.stringify({ 
        news: filteredCachedNews,
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
    try {
      news = await fetchAlphaVantageNews(tickers);
      if (news.length > 0) {
        console.log(`Successfully fetched ${news.length} news items from Alpha Vantage`);
        dataSource = 'Alpha Vantage';
      }
    } catch (error) {
      console.error('Error with Alpha Vantage news fetch:', error);
    }
    
    if (news.length === 0) {
      try {
        news = await fetchFinnhubNews(symbols);
        if (news.length > 0) {
          console.log(`Successfully fetched ${news.length} news items from Finnhub`);
          dataSource = 'Finnhub';
        }
      } catch (error) {
        console.error('Error with Finnhub news fetch:', error);
      }
    }
    
    if (news.length === 0) {
      try {
        news = await fetchNewsApi(symbols);
        if (news.length > 0) {
          console.log(`Successfully fetched ${news.length} news items from News API`);
          dataSource = 'News API';
        }
      } catch (error) {
        console.error('Error with News API fetch:', error);
      }
    }
    
    // Last resort - try to get any financial news if specific news failed
    if (news.length === 0) {
      console.log('No specific news found, trying fallback news');
      try {
        news = await fetchFallbackNews();
        if (news.length > 0) {
          console.log(`Successfully fetched ${news.length} fallback news items`);
          dataSource = 'Fallback';
        }
      } catch (error) {
        console.error('Error with fallback news fetch:', error);
      }
    }
    
    // Filter by categories if specified
    if (categories && categories.length > 0 && news.length > 0) {
      console.log(`Filtering news by categories: ${categories.join(', ')}`);
      const filteredNews = filterNewsByCategories(news, categories);
      console.log(`Filtered news: ${filteredNews.length} of ${news.length} articles match the categories`);
      news = filteredNews;
    }
    
    // Sort by publishedAt date (newest first)
    news = news.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    console.log(`Returning ${news.length} news articles from ${dataSource}`);
    
    // Save to cache for future use
    if (news.length > 0) {
      console.log('Saving news to cache');
      // Use try/catch to prevent cache errors from affecting response
      try {
        await saveNewsToCache(news, symbols, categories);
      } catch (cacheError) {
        console.error('Error saving to cache, but continuing with response:', cacheError);
      }
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
