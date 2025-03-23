
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Quote } from '@/types/marketData';

/**
 * Fetches initial market data for the specified symbols
 */
export const fetchInitialMarketData = async (symbols: string[]): Promise<Record<string, Quote>> => {
  if (!symbols.length) return {};
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch-real-time-market-data', {
      body: { symbols }
    });
    
    if (error) throw new Error(error.message);
    
    // Log successful connection to help with debugging
    console.log('Successfully fetched initial market data for symbols:', symbols);
    console.log('Market data response:', data);
    
    return data.quotes || {};
  } catch (err) {
    console.error('Error fetching initial market data:', err);
    toast.error('Failed to fetch market data, falling back to mock data');
    
    // Return mock data as fallback
    return symbols.reduce((acc, symbol) => {
      acc[symbol] = {
        symbol,
        price: Math.random() * 1000 + 50,
        bid: Math.random() * 1000 + 49,
        ask: Math.random() * 1000 + 51,
        timestamp: Date.now(),
        volume: Math.floor(Math.random() * 10000000),
        changePercent: (Math.random() * 6) - 3, // Between -3% and +3%
      };
      return acc;
    }, {} as Record<string, Quote>);
  }
};

/**
 * Fetches latest market data (top gainers, losers, and most active stocks)
 */
export const fetchLatestMarketData = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { function: 'TOP_GAINERS_LOSERS' }
    });
    
    if (error) throw new Error(error.message);
    
    return data;
  } catch (err) {
    console.error('Error fetching latest market data:', err);
    toast.error('Failed to fetch latest market trends');
    throw err;
  }
};

/**
 * Fetches trending stocks for the dashboard
 */
export const fetchTrendingStocks = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { function: 'MOST_ACTIVE' }
    });
    
    if (error) throw new Error(error.message);
    
    return data.most_actively_traded || [];
  } catch (err) {
    console.error('Error fetching trending stocks:', err);
    return [];
  }
};
