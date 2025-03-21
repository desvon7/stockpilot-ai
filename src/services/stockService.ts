
import { supabase } from '@/integrations/supabase/client';

export interface StockQuote {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
      body: { symbol, function: 'GLOBAL_QUOTE' },
    });

    if (error) throw error;

    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('No quote data returned');
    }

    return {
      symbol: quote['01. symbol'],
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      price: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};

export const searchStocks = async (query: string): Promise<StockSearchResult[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('search-stocks', {
      body: { query },
    });

    if (error) throw error;

    const results = data.bestMatches || [];
    return results.map((result: any) => ({
      symbol: result['1. symbol'],
      name: result['2. name'],
      type: result['3. type'],
      region: result['4. region'],
      marketOpen: result['5. marketOpen'],
      marketClose: result['6. marketClose'],
      timezone: result['7. timezone'],
      currency: result['8. currency'],
      matchScore: result['9. matchScore'],
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

export const getAIRecommendations = async (symbol: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('stock-ai-recommendations', {
      body: { symbol },
    });

    if (error) throw error;
    return data.recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
};
