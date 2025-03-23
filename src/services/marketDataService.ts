
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Quote } from '@/types/marketData';

/**
 * Fetches initial market data for the specified symbols
 */
export const fetchInitialMarketData = async (symbols: string[]): Promise<Record<string, Quote>> => {
  if (!symbols.length) return {};
  
  try {
    console.log('Fetching initial market data for symbols:', symbols);
    
    // Check if we're in a dev environment
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.log('Development mode: Using mock market data');
      // Return mock data
      return getMockMarketData(symbols);
    }
    
    const { data, error } = await supabase.functions.invoke('fetch-real-time-market-data', {
      body: { symbols }
    });
    
    if (error) {
      console.error('Error from supabase function:', error);
      throw new Error(error.message);
    }
    
    // Log successful connection to help with debugging
    console.log('Successfully fetched initial market data for symbols:', symbols);
    
    if (!data || !data.quotes) {
      console.warn('No quote data returned from API');
      throw new Error('No market data available');
    }
    
    return data.quotes || {};
  } catch (err) {
    console.error('Error fetching initial market data:', err);
    toast.error('Failed to fetch market data, using mock data');
    
    // Return mock data as fallback
    return getMockMarketData(symbols);
  }
};

/**
 * Helper function to generate mock market data
 */
function getMockMarketData(symbols: string[]): Record<string, Quote> {
  return symbols.reduce((acc, symbol) => {
    acc[symbol] = {
      symbol,
      price: Math.random() * 1000 + 50,
      bid: Math.random() * 1000 + 49,
      ask: Math.random() * 1000 + 51,
      timestamp: Date.now(),
      volume: Math.floor(Math.random() * 10000000),
      change: (Math.random() * 20) - 10,
      changePercent: (Math.random() * 6) - 3, // Between -3% and +3%
      previousClose: Math.random() * 1000 + 45,
    };
    return acc;
  }, {} as Record<string, Quote>);
}

/**
 * Fetches latest market data (top gainers, losers, and most active stocks)
 */
export const fetchLatestMarketData = async () => {
  try {
    // Check if we're in a dev environment
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.log('Development mode: Using mock latest market data');
      return {
        top_gainers: [
          { symbol: 'TSLA', change_percentage: '5.23%', price: 248.5 },
          { symbol: 'NVDA', change_percentage: '4.89%', price: 950.2 },
          { symbol: 'AMD', change_percentage: '3.75%', price: 178.3 },
        ],
        top_losers: [
          { symbol: 'META', change_percentage: '-2.15%', price: 512.7 },
          { symbol: 'NFLX', change_percentage: '-1.83%', price: 678.4 },
          { symbol: 'AMZN', change_percentage: '-1.21%', price: 182.8 },
        ],
        most_active: [
          { symbol: 'AAPL', volume: '42.3M', price: 198.5 },
          { symbol: 'MSFT', volume: '38.1M', price: 415.9 },
          { symbol: 'GOOGL', volume: '31.5M', price: 171.2 },
        ]
      };
    }
    
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { function: 'TOP_GAINERS_LOSERS' }
    });
    
    if (error) throw new Error(error.message);
    
    return data;
  } catch (err) {
    console.error('Error fetching latest market data:', err);
    toast.error('Failed to fetch latest market trends');
    
    // Return mock data as fallback
    return {
      top_gainers: [
        { symbol: 'TSLA', change_percentage: '5.23%', price: 248.5 },
        { symbol: 'NVDA', change_percentage: '4.89%', price: 950.2 },
        { symbol: 'AMD', change_percentage: '3.75%', price: 178.3 },
      ],
      top_losers: [
        { symbol: 'META', change_percentage: '-2.15%', price: 512.7 },
        { symbol: 'NFLX', change_percentage: '-1.83%', price: 678.4 },
        { symbol: 'AMZN', change_percentage: '-1.21%', price: 182.8 },
      ],
      most_active: [
        { symbol: 'AAPL', volume: '42.3M', price: 198.5 },
        { symbol: 'MSFT', volume: '38.1M', price: 415.9 },
        { symbol: 'GOOGL', volume: '31.5M', price: 171.2 },
      ]
    };
  }
};

/**
 * Fetches trending stocks for the dashboard
 */
export const fetchTrendingStocks = async () => {
  try {
    // Check if we're in a dev environment
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.log('Development mode: Using mock trending stocks data');
      return [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change_percent: 1.23 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.28, change_percent: 0.87 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 171.95, change_percent: -0.42 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 182.41, change_percent: 1.56 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 177.29, change_percent: 2.31 },
        { symbol: 'META', name: 'Meta Platforms Inc.', price: 513.51, change_percent: 0.75 }
      ];
    }
    
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { function: 'MOST_ACTIVE' }
    });
    
    if (error) throw new Error(error.message);
    
    return data.most_actively_traded || [];
  } catch (err) {
    console.error('Error fetching trending stocks:', err);
    
    // Return fallback trending stocks
    return [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change_percent: 1.23 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.28, change_percent: 0.87 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 171.95, change_percent: -0.42 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 182.41, change_percent: 1.56 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 177.29, change_percent: 2.31 },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 513.51, change_percent: 0.75 }
    ];
  }
};

/**
 * Fetches market indices data (S&P 500, Dow Jones, Nasdaq, etc.)
 */
export const fetchMarketIndices = async () => {
  try {
    // Check if we're in a dev environment
    const isDev = import.meta.env.DEV;
    
    if (isDev) {
      console.log('Development mode: Using mock market indices data');
      return [
        { name: 'S&P 500', value: 5234.73, change: 23.16, changePercent: 0.51 },
        { name: 'Dow Jones', value: 38941.81, change: 128.32, changePercent: 0.35 },
        { name: 'Nasdaq', value: 16394.16, change: 42.38, changePercent: 0.26 },
        { name: 'Russell 2000', value: 2157.84, change: 15.73, changePercent: 0.73 }
      ];
    }
    
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { function: 'MARKET_INDICES' }
    });
    
    if (error) throw new Error(error.message);
    
    return data || [];
  } catch (err) {
    console.error('Error fetching market indices:', err);
    
    // Return mock data as fallback
    return [
      { name: 'S&P 500', value: 5234.73, change: 23.16, changePercent: 0.51 },
      { name: 'Dow Jones', value: 38941.81, change: 128.32, changePercent: 0.35 },
      { name: 'Nasdaq', value: 16394.16, change: 42.38, changePercent: 0.26 },
      { name: 'Russell 2000', value: 2157.84, change: 15.73, changePercent: 0.73 }
    ];
  }
};
