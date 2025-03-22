
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY') || '';
const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY') || '';

// Enhanced fallback data with more diverse assets
const FALLBACK_SEARCH_RESULTS = [
  // ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'IEFA', name: 'iShares Core MSCI EAFE ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Popular stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'V', name: 'Visa Inc.', type: 'Equity', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Index funds
  { symbol: 'VFIAX', name: 'Vanguard 500 Index Fund', type: 'Mutual Fund', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VTSAX', name: 'Vanguard Total Stock Market Index Fund', type: 'Mutual Fund', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Sector ETFs
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  
  // Crypto proxies
  { symbol: 'GBTC', name: 'Grayscale Bitcoin Trust', type: 'Trust', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'ETHE', name: 'Grayscale Ethereum Trust', type: 'Trust', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
];

// Fetch stock symbols from Finnhub as an additional data source
async function searchFinnhub(query: string) {
  if (!FINNHUB_API_KEY) {
    console.log('No Finnhub API key provided, skipping Finnhub search');
    return null;
  }
  
  try {
    const url = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Finnhub API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result || data.result.length === 0) {
      return null;
    }
    
    // Transform Finnhub data to match our format
    return data.result.map((item: any) => ({
      symbol: item.symbol,
      name: item.description,
      type: item.type === 'Common Stock' ? 'Equity' : item.type,
      region: 'United States',
      marketOpen: '09:30',
      marketClose: '16:00',
      timezone: 'UTC-05',
      currency: 'USD',
      matchScore: '1.0000'
    }));
  } catch (error) {
    console.error('Error searching Finnhub:', error);
    return null;
  }
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
    
    console.log(`Searching for stocks with query: ${query}`);
    
    let alphaVantageData = null;
    let finnhubData = null;
    
    // Try to get data from Alpha Vantage
    if (ALPHA_VANTAGE_API_KEY) {
      try {
        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.bestMatches && data.bestMatches.length > 0 && !data.Note) {
            // Add more stock types if needed
            alphaVantageData = data.bestMatches.map((result: any) => {
              // Identify ETFs by their names
              if (result['2. name'].includes('ETF') && result['3. type'] !== 'ETF') {
                return { ...result, '3. type': 'ETF' };
              }
              return result;
            });
          }
        }
      } catch (error) {
        console.error('Error searching Alpha Vantage:', error);
      }
    }
    
    // Try to get data from Finnhub as a secondary source
    if (!alphaVantageData || alphaVantageData.length === 0) {
      finnhubData = await searchFinnhub(query);
    }
    
    // If we got data from Alpha Vantage, use that
    if (alphaVantageData && alphaVantageData.length > 0) {
      return new Response(
        JSON.stringify({ bestMatches: alphaVantageData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If we got data from Finnhub, use that
    if (finnhubData && finnhubData.length > 0) {
      // Transform to match Alpha Vantage format
      const transformedData = finnhubData.map((item: any) => ({
        '1. symbol': item.symbol,
        '2. name': item.name,
        '3. type': item.type,
        '4. region': item.region,
        '5. marketOpen': item.marketOpen,
        '6. marketClose': item.marketClose,
        '7. timezone': item.timezone,
        '8. currency': item.currency,
        '9. matchScore': item.matchScore
      }));
      
      return new Response(
        JSON.stringify({ bestMatches: transformedData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If all APIs failed or returned no results, use fallback data
    console.log('Using fallback data for search query:', query);
    
    // Filter fallback results based on the query
    const filteredResults = FALLBACK_SEARCH_RESULTS.filter(item => 
      item.symbol.toLowerCase().includes(query.toLowerCase()) || 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Transform to match Alpha Vantage format
    const formattedResults = filteredResults.map(item => ({
      '1. symbol': item.symbol,
      '2. name': item.name,
      '3. type': item.type,
      '4. region': item.region,
      '5. marketOpen': item.marketOpen,
      '6. marketClose': item.marketClose,
      '7. timezone': item.timezone,
      '8. currency': item.currency,
      '9. matchScore': item.matchScore
    }));
    
    return new Response(
      JSON.stringify({ 
        bestMatches: formattedResults.length > 0 ? formattedResults : [],
        source: 'fallback'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching stocks:', error);
    
    // Return fallback data on error
    const formattedResults = FALLBACK_SEARCH_RESULTS.map(item => ({
      '1. symbol': item.symbol,
      '2. name': item.name,
      '3. type': item.type,
      '4. region': item.region,
      '5. marketOpen': item.marketOpen,
      '6. marketClose': item.marketClose,
      '7. timezone': item.timezone,
      '8. currency': item.currency,
      '9. matchScore': item.matchScore
    }));
    
    return new Response(
      JSON.stringify({ 
        bestMatches: formattedResults,
        error: error.message || 'Failed to search stocks',
        source: 'fallback'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
