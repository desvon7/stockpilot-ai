
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PolygonTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  description: string;
  homepage_url?: string;
  total_employees?: number;
  list_date?: string;
  market_cap?: number;
  phone_number?: string;
  address?: {
    address1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  sic_code?: string;
  sic_description?: string;
}

export interface PolygonPreviousClose {
  ticker: string;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  otc: boolean;
}

export interface PolygonAggregateBar {
  c: number; // close
  h: number; // high
  l: number; // low
  o: number; // open
  v: number; // volume
  t: number; // timestamp
  vw?: number; // volume weighted average price
  n?: number; // number of transactions
}

export interface PolygonHistoricalData {
  ticker: string;
  adjusted: boolean;
  queryCount: number;
  request_id: string;
  resultsCount: number;
  status: string;
  results: PolygonAggregateBar[];
}

export interface PolygonNewsItem {
  id: string;
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  tickers: string[];
  image_url?: string;
  description?: string;
  keywords?: string[];
  amp_url?: string;
}

export interface PolygonMarketStatus {
  market: string;
  serverTime: string;
  exchanges: {
    [key: string]: {
      name: string;
      type: string;
      market: string;
      tape: string;
      code: number;
      session_start?: string;
      session_end?: string;
      extended_session_start?: string;
      extended_session_end?: string;
    };
  };
  currencies: {
    [key: string]: {
      name: string;
      status: string;
      next_open?: string;
      next_close?: string;
    };
  };
}

/**
 * Fetches detailed information about a ticker symbol
 */
export const getTickerDetails = async (ticker: string): Promise<PolygonTickerDetails> => {
  try {
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { endpoint: 'ticker_details', ticker }
    });

    if (error) throw new Error(error.message);
    return data.results;
  } catch (err) {
    console.error('Error fetching ticker details:', err);
    toast.error('Failed to fetch ticker details');
    throw err instanceof Error ? err : new Error('Failed to fetch ticker details');
  }
};

/**
 * Fetches the previous day's OHLC data for a ticker
 */
export const getPreviousClose = async (ticker: string): Promise<PolygonPreviousClose> => {
  try {
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { endpoint: 'previous_close', ticker }
    });

    if (error) throw new Error(error.message);
    return data.results[0];
  } catch (err) {
    console.error('Error fetching previous close:', err);
    toast.error('Failed to fetch previous day data');
    throw err instanceof Error ? err : new Error('Failed to fetch previous day data');
  }
};

/**
 * Fetches intraday (minute) data for a ticker for the current day
 */
export const getIntradayData = async (ticker: string): Promise<PolygonHistoricalData> => {
  try {
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { endpoint: 'intraday', ticker }
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('Error fetching intraday data:', err);
    toast.error('Failed to fetch intraday data');
    throw err instanceof Error ? err : new Error('Failed to fetch intraday data');
  }
};

/**
 * Fetches historical price data for a ticker between two dates
 */
export const getHistoricalData = async (
  ticker: string, 
  from: string, 
  to: string,
  timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day'
): Promise<PolygonHistoricalData> => {
  try {
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { endpoint: 'historical', ticker, from, to, timespan }
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('Error fetching historical data:', err);
    toast.error('Failed to fetch historical data');
    throw err instanceof Error ? err : new Error('Failed to fetch historical data');
  }
};

/**
 * Fetches news articles for a ticker
 */
export const getTickerNews = async (ticker: string): Promise<PolygonNewsItem[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { endpoint: 'news', ticker }
    });

    if (error) throw new Error(error.message);
    return data.results;
  } catch (err) {
    console.error('Error fetching news:', err);
    toast.error('Failed to fetch news articles');
    throw err instanceof Error ? err : new Error('Failed to fetch news articles');
  }
};

/**
 * Fetches the current market status
 */
export const getMarketStatus = async (): Promise<PolygonMarketStatus> => {
  try {
    const { data, error } = await supabase.functions.invoke('polygon-market-data', {
      body: { endpoint: 'market_status' }
    });

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('Error fetching market status:', err);
    toast.error('Failed to fetch market status');
    throw err instanceof Error ? err : new Error('Failed to fetch market status');
  }
};
