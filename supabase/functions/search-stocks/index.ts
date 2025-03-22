
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { formatToAlphaVantageFormat } from "./utils/formatters.ts";
import { searchAlphaVantage } from "./providers/alphaVantage.ts";
import { searchFinnhub } from "./providers/finnhub.ts";
import { searchFallbackData } from "./providers/fallback.ts";
import { SearchResponse } from "./types.ts";

// API Keys
const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY') || '';
const FINNHUB_API_KEY = Deno.env.get('FINN_HUB_API_KEY') || '';

async function searchStocks(query: string): Promise<SearchResponse> {
  console.log(`Searching for stocks with query: ${query}`);
  
  // Try Alpha Vantage first
  const alphaVantageData = await searchAlphaVantage(query, ALPHA_VANTAGE_API_KEY);
  if (alphaVantageData && alphaVantageData.length > 0) {
    console.log(`Successfully found ${alphaVantageData.length} results from Alpha Vantage`);
    return { bestMatches: alphaVantageData };
  }
  
  // Try Finnhub as a secondary source
  const finnhubData = await searchFinnhub(query, FINNHUB_API_KEY);
  if (finnhubData && finnhubData.length > 0) {
    console.log(`Successfully found ${finnhubData.length} results from Finnhub`);
    return { 
      bestMatches: formatToAlphaVantageFormat(finnhubData),
      source: 'Finnhub'
    };
  }
  
  // Fallback to local data if no API results were returned
  const fallbackResults = searchFallbackData(query);
  console.log(`Returning ${fallbackResults.length} results from fallback data`);
  
  return { 
    bestMatches: formatToAlphaVantageFormat(fallbackResults),
    source: 'fallback'
  };
}

function handleError(error: Error): SearchResponse {
  console.error('Error searching stocks:', error);
  
  // Return fallback data on error
  const allFallbackResults = searchFallbackData('');
  return { 
    bestMatches: formatToAlphaVantageFormat(allFallbackResults),
    error: error.message || 'Failed to search stocks',
    source: 'fallback'
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const searchResults = await searchStocks(query);
    
    return new Response(
      JSON.stringify(searchResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorResponse = handleError(error);
    
    return new Response(
      JSON.stringify(errorResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
