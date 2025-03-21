
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY') || '';
const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY') || '';

// Use mock data for demo purposes (in case API keys are not set)
const MOCK_PRICE_DATA: Record<string, any> = {
  'AAPL': { price: 187.68, change: 1.84, changePercent: 0.99 },
  'MSFT': { price: 412.66, change: 2.41, changePercent: 0.59 },
  'GOOGL': { price: 152.16, change: -0.74, changePercent: -0.48 },
  'AMZN': { price: 178.28, change: 0.95, changePercent: 0.54 },
  'META': { price: 474.09, change: 4.21, changePercent: 0.90 },
  'TSLA': { price: 174.88, change: -3.92, changePercent: -2.19 },
  'NVDA': { price: 893.45, change: 11.23, changePercent: 1.27 },
  'BRK.B': { price: 404.63, change: 0.88, changePercent: 0.22 },
  'JPM': { price: 197.41, change: 2.13, changePercent: 1.09 },
  'JNJ': { price: 155.76, change: -0.42, changePercent: -0.27 },
};

interface RequestData {
  symbols: string[];
}

async function fetchPriceData(symbol: string): Promise<any> {
  if (!ALPHA_VANTAGE_API_KEY && !FINNHUB_API_KEY) {
    // Return mock data if no API keys are available
    return MOCK_PRICE_DATA[symbol] || { 
      price: (Math.random() * 500 + 50).toFixed(2), 
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: (Math.random() * 5 - 2.5).toFixed(2)
    };
  }

  try {
    if (FINNHUB_API_KEY) {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const data = await response.json();
      
      if (data && data.c) {
        return {
          price: data.c,
          change: data.d,
          changePercent: data.dp
        };
      }
    } else if (ALPHA_VANTAGE_API_KEY) {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      const data = await response.json();
      
      if (data && data['Global Quote']) {
        const quote = data['Global Quote'];
        return {
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
        };
      }
    }
    
    throw new Error('No valid API key or invalid response');
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    
    // Fallback to mock data
    return MOCK_PRICE_DATA[symbol] || { 
      price: (Math.random() * 500 + 50).toFixed(2), 
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: (Math.random() * 5 - 2.5).toFixed(2)
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      status: 204,
    });
  }

  try {
    const { symbols = [] } = await req.json() as RequestData;
    
    if (!symbols.length) {
      return new Response(
        JSON.stringify({ error: 'No symbols provided' }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Limit to max 20 symbols per request
    const limitedSymbols = symbols.slice(0, 20);
    
    // Fetch price data for all symbols in parallel
    const priceRequests = limitedSymbols.map(async (symbol) => {
      const data = await fetchPriceData(symbol);
      return [symbol, data];
    });
    
    const priceResults = await Promise.all(priceRequests);
    const priceData = Object.fromEntries(priceResults);

    return new Response(
      JSON.stringify(priceData),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
