
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY') || '';
const FALLBACK_SEARCH_RESULTS = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'IEFA', name: 'iShares Core MSCI EAFE ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' },
  { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF', type: 'ETF', region: 'United States', marketOpen: '09:30', marketClose: '16:00', timezone: 'UTC-05', currency: 'USD', matchScore: '1.0000' }
];

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
    
    // Fetch search results from Alpha Vantage API
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // If there are no results from Alpha Vantage or we hit the rate limit
    if (!data.bestMatches || data.bestMatches.length === 0 || data.Note) {
      console.log('Using fallback data due to empty results or rate limit');
      
      // Filter fallback results based on the query
      const filteredResults = FALLBACK_SEARCH_RESULTS.filter(item => 
        item.symbol.toLowerCase().includes(query.toLowerCase()) || 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      
      return new Response(
        JSON.stringify({ bestMatches: filteredResults }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Add more stock types if needed
    const enhancedResults = data.bestMatches.map(result => {
      // Identify ETFs by their names (many ETFs have "ETF" in their name)
      if (result['2. name'].includes('ETF') && result['3. type'] !== 'ETF') {
        return { ...result, '3. type': 'ETF' };
      }
      return result;
    });
    
    return new Response(
      JSON.stringify({ bestMatches: enhancedResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching stocks:', error);
    
    // Return fallback data on error
    return new Response(
      JSON.stringify({ 
        bestMatches: FALLBACK_SEARCH_RESULTS,
        error: error.message || 'Failed to search stocks'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
