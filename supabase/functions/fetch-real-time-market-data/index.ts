
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALPACA_API_KEY = Deno.env.get('ALPACA_API_KEY');
const ALPACA_API_SECRET = Deno.env.get('ALPACA_API_SECRET');

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
    const { symbols } = await req.json();
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      throw new Error('Invalid or missing symbols array');
    }

    if (!ALPACA_API_KEY || !ALPACA_API_SECRET) {
      throw new Error('Alpaca API credentials not configured');
    }

    console.log(`Fetching real-time quotes for symbols: ${symbols.join(', ')}`);

    // Fetch real-time quotes from Alpaca
    const response = await fetch(
      `https://data.alpaca.markets/v2/stocks/quotes/latest?symbols=${symbols.join(',')}`,
      {
        headers: {
          'APCA-API-KEY-ID': ALPACA_API_KEY,
          'APCA-API-SECRET-KEY': ALPACA_API_SECRET
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Alpaca API error:', errorText);
      throw new Error(`Alpaca API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Format the response data
    const formattedData = Object.entries(data.quotes || {}).reduce((acc, [symbol, quote]) => {
      const quoteData = quote as any;
      const askPrice = quoteData.ap || 0;
      const bidPrice = quoteData.bp || 0;
      const price = askPrice || bidPrice || 0;
      
      acc[symbol] = {
        symbol,
        price,
        bid: bidPrice,
        ask: askPrice,
        bidSize: quoteData.bs,
        askSize: quoteData.as,
        timestamp: quoteData.t,
        volume: 0, // We'll need to fetch this separately
      };
      return acc;
    }, {} as Record<string, any>);

    console.log(`Successfully fetched quotes for ${Object.keys(formattedData).length} symbols`);
    
    return new Response(JSON.stringify({ quotes: formattedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-real-time-market-data function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
