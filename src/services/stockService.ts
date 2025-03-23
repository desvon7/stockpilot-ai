
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export interface StockDetails extends StockQuote {
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  dividend: number;
  dividendYield: number;
  eps: number;
  beta: number;
  yearHigh: number;
  yearLow: number;
  avgVolume: number;
}

export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    console.log(`Fetching stock quote for symbol: ${symbol}`);
    const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
      body: { symbol, function: 'GLOBAL_QUOTE' },
    });

    if (error) {
      console.error('Error from Supabase function:', error);
      throw error;
    }

    const quote = data['Global Quote'];
    if (!quote) {
      console.error('No quote data returned for symbol:', symbol, data);
      throw new Error('No quote data returned');
    }

    console.log(`Successfully fetched quote for ${symbol}:`, quote);

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
  if (!query || query.length < 2) {
    return [];
  }
  
  try {
    console.log(`Searching stocks with query: ${query}`);
    const { data, error } = await supabase.functions.invoke('search-stocks', {
      body: { query },
    });

    if (error) {
      console.error('Error from search-stocks function:', error);
      throw error;
    }

    const results = data.bestMatches || [];
    console.log(`Search returned ${results.length} results for "${query}"`);
    
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
    toast.error(`Search failed for "${query}"`);
    throw error;
  }
};

export const fetchMarketData = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { function: 'TOP_GAINERS_LOSERS' },
    });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
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

export const fetchTrendingStocks = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { function: 'MOST_ACTIVE' },
    });

    if (error) throw error;
    return data.most_actively_traded || [];
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    throw error;
  }
};

export const fetchStockDetails = async (symbol: string): Promise<StockDetails> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
      body: { symbol, function: 'OVERVIEW' },
    });

    if (error) throw error;
    
    // Process and return the stock details
    return {
      symbol: data.Symbol || symbol,
      name: data.Name || '',
      price: 0, // This will be populated from quote data
      open: 0,
      high: 0,
      low: 0,
      volume: parseInt(data.Volume || '0'),
      avgVolume: parseInt(data.AverageVolume || '0'),
      latestTradingDay: '',
      previousClose: 0,
      change: 0,
      changePercent: '',
      marketCap: parseFloat(data.MarketCapitalization || '0'),
      peRatio: parseFloat(data.PERatio || '0'),
      dividend: parseFloat(data.DividendPerShare || '0'),
      dividendYield: parseFloat(data.DividendYield || '0') * 100,
      eps: parseFloat(data.EPS || '0'),
      beta: parseFloat(data.Beta || '0'),
      yearHigh: parseFloat(data['52WeekHigh'] || '0'),
      yearLow: parseFloat(data['52WeekLow'] || '0'),
      sector: data.Sector || '',
      industry: data.Industry || '',
    };
  } catch (error) {
    console.error('Error fetching stock details:', error);
    throw error;
  }
};
