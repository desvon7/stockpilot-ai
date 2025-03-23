
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
    
    return data.quotes || {};
  } catch (err) {
    console.error('Error fetching initial market data:', err);
    toast.error('Failed to fetch market data');
    throw err instanceof Error ? err : new Error('Failed to fetch market data');
  }
};
