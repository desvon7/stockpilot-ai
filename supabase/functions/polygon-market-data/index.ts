
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const POLYGON_API_KEY = Deno.env.get('POLYGON_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, ticker, from, to, timespan = 'day' } = await req.json();
    
    if (!POLYGON_API_KEY) {
      throw new Error('Polygon API key is not configured');
    }

    console.log(`Fetching Polygon data - endpoint: ${endpoint}, ticker: ${ticker}`);
    
    let url = '';
    
    // Build URL based on the requested endpoint
    switch (endpoint) {
      case 'ticker_details':
        url = `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${POLYGON_API_KEY}`;
        break;
      case 'previous_close':
        url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${POLYGON_API_KEY}`;
        break;
      case 'intraday':
        url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/minute/today?apiKey=${POLYGON_API_KEY}`;
        break;
      case 'historical':
        if (!from || !to) {
          throw new Error('From and to dates are required for historical data');
        }
        url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/${timespan}/${from}/${to}?apiKey=${POLYGON_API_KEY}`;
        break;
      case 'news':
        url = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${POLYGON_API_KEY}`;
        break;
      case 'market_status':
        url = `https://api.polygon.io/v1/marketstatus/now?apiKey=${POLYGON_API_KEY}`;
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    // Add a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Polygon API error (${response.status}): ${errorText}`);
        throw new Error(`Polygon API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Polygon API request timed out');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error in polygon-market-data function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while fetching market data' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
