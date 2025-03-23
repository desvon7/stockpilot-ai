
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const POLYGON_API_KEY = Deno.env.get('POLYGON_API_KEY') || '';
const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to fetch news from different sources and combine them
async function fetchNewsFromSources(symbols: string[] = [], categories: string[] = [], limit: number = 30) {
  const results = [];
  let errors = [];

  // Try to get news from Polygon.io for specific stocks
  if (symbols.length > 0 && POLYGON_API_KEY) {
    try {
      const tickers = symbols.join(',');
      const response = await fetch(
        `https://api.polygon.io/v2/reference/news?ticker=${tickers}&limit=${limit}&apiKey=${POLYGON_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const polygonNews = data.results.map((item: any) => ({
          id: `polygon-${item.id}`,
          title: item.title,
          summary: item.description,
          source: item.publisher.name,
          publishedAt: item.published_utc,
          url: item.article_url,
          imageUrl: item.image_url,
          symbols: item.tickers,
          categories: item.keywords || [],
          sentiment: calculateSentiment(item.title + ' ' + item.description),
          provider: 'polygon'
        }));
        results.push(...polygonNews);
      } else {
        errors.push(`Polygon API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching from Polygon:', error);
      errors.push(`Polygon API error: ${error.message}`);
    }
  }

  // Use NewsAPI for categories and general financial news
  if (NEWS_API_KEY) {
    try {
      // Map our categories to what NewsAPI expects
      const categoryMapping: Record<string, string> = {
        'general': 'business',
        'economy': 'business',
        'markets': 'business',
        'stocks': 'business',
        'technology': 'technology',
        'crypto': 'business',
        'energy': 'business'
      };
      
      // Convert categories or use default
      const newsApiCategories = categories.map(cat => categoryMapping[cat] || 'business');
      const uniqueCategories = [...new Set(newsApiCategories)];
      
      // Build proper query
      let queryParts = [];
      if (symbols.length > 0) {
        queryParts.push(symbols.join(' OR '));
      }
      
      // Add some finance keywords
      queryParts.push('finance OR market OR trading OR investment OR stocks');
      
      const query = encodeURIComponent(queryParts.join(' AND '));
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const newsApiResults = data.articles.map((item: any, index: number) => ({
          id: `newsapi-${index}-${Date.now()}`,
          title: item.title,
          summary: item.description || item.content,
          source: item.source.name,
          publishedAt: item.publishedAt,
          url: item.url,
          imageUrl: item.urlToImage,
          symbols: extractSymbols(item.title + ' ' + (item.description || '')),
          categories: determineCategories(item.title, item.description),
          sentiment: calculateSentiment(item.title + ' ' + (item.description || '')),
          provider: 'newsapi'
        }));
        results.push(...newsApiResults);
      } else {
        errors.push(`NewsAPI error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
      errors.push(`NewsAPI error: ${error.message}`);
    }
  }

  // Sort all results by date, newest first
  results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  // Remove duplicates (by title)
  const uniqueResults = results.filter((item, index, self) => 
    index === self.findIndex(t => t.title === item.title)
  );
  
  // Limit to requested number
  return {
    news: uniqueResults.slice(0, limit),
    sources: [...new Set(uniqueResults.map(item => item.source))],
    errors: errors.length > 0 ? errors : null
  };
}

// Simple sentiment analysis based on keywords
function calculateSentiment(text: string): number {
  const positiveWords = ['growth', 'profit', 'gain', 'surge', 'rise', 'up', 'increase', 'positive', 'bull', 'rally', 'recover', 'improvement', 'upward'];
  const negativeWords = ['fall', 'drop', 'decline', 'loss', 'down', 'decrease', 'negative', 'bear', 'crash', 'plunge', 'slump', 'recession', 'downward'];
  
  const textLower = text.toLowerCase();
  
  let score = 0;
  positiveWords.forEach(word => {
    if (textLower.includes(word)) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (textLower.includes(word)) score -= 1;
  });
  
  // Normalize to range -1 to 1
  return score === 0 ? 0 : score / Math.max(Math.abs(score), 3);
}

// Extract potential stock symbols from text
function extractSymbols(text: string): string[] {
  // Look for patterns like $AAPL, $MSFT, etc.
  const symbolRegex = /\$([A-Z]{1,5})/g;
  const matches = [...text.matchAll(symbolRegex)];
  return matches.map(match => match[1]);
}

// Determine news categories based on content
function determineCategories(title: string, description: string = ''): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const categories = [];
  
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum') || text.includes('blockchain')) {
    categories.push('crypto');
  }
  
  if (text.includes('stock') || text.includes('share') || text.includes('equity') || text.includes('nasdaq') || text.includes('nyse')) {
    categories.push('stocks');
  }
  
  if (text.includes('economy') || text.includes('gdp') || text.includes('inflation') || text.includes('federal reserve') || text.includes('fed')) {
    categories.push('economy');
  }
  
  if (text.includes('market') || text.includes('trading') || text.includes('index') || text.includes('s&p') || text.includes('dow jones')) {
    categories.push('markets');
  }
  
  if (text.includes('tech') || text.includes('technology') || text.includes('software') || text.includes('ai') || text.includes('artificial intelligence')) {
    categories.push('technology');
  }
  
  if (text.includes('oil') || text.includes('gas') || text.includes('renewable') || text.includes('energy')) {
    categories.push('energy');
  }
  
  // If no specific category was found, add general
  if (categories.length === 0) {
    categories.push('general');
  }
  
  return categories;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols = [], categories = ['general'], limit = 30 } = await req.json();
    
    // Make sure symbols is an array
    const symbolsArray = Array.isArray(symbols) ? symbols : [symbols].filter(Boolean);
    const categoriesArray = Array.isArray(categories) ? categories : [categories].filter(Boolean);
    
    console.log(`Fetching news for symbols: [${symbolsArray.join(', ')}], categories: [${categoriesArray.join(', ')}]`);
    
    const newsData = await fetchNewsFromSources(symbolsArray, categoriesArray, limit);
    
    console.log(`Returning ${newsData.news.length} news items from ${newsData.sources.length} sources`);
    
    return new Response(JSON.stringify(newsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-financial-news function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch news',
      news: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
