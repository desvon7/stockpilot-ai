
import { supabase } from '@/lib/supabase';
import { setAlert } from './alertActions';
import {
  GET_STOCK,
  GET_STOCK_CHART,
  GET_STOCK_NEWS,
  SEARCH_STOCKS,
  GET_TOP_GAINERS,
  GET_TOP_LOSERS,
  STOCK_ERROR,
  CLEAR_STOCK
} from './types';

// Get stock by symbol
export const getStock = (symbol: string) => async (dispatch: any) => {
  try {
    // Call our supabase edge function
    const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
      body: { symbol }
    });

    if (error) throw error;

    dispatch({
      type: GET_STOCK,
      payload: data
    });
  } catch (err: any) {
    console.error('Get stock error:', err);
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Get stock chart data
export const getStockChart = (
  symbol: string, 
  resolution = 'D', 
  from?: number, 
  to?: number
) => async (dispatch: any) => {
  try {
    // Call our supabase edge function
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { 
        symbol,
        resolution,
        from,
        to 
      }
    });

    if (error) throw error;

    dispatch({
      type: GET_STOCK_CHART,
      payload: data
    });
  } catch (err: any) {
    console.error('Get stock chart error:', err);
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Get stock news
export const getStockNews = (symbol: string) => async (dispatch: any) => {
  try {
    // Call our supabase edge function
    const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
      body: { 
        symbol,
        limit: 10
      }
    });

    if (error) throw error;

    dispatch({
      type: GET_STOCK_NEWS,
      payload: data
    });
  } catch (err: any) {
    console.error('Get stock news error:', err);
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Search stocks
export const searchStocks = (query: string) => async (dispatch: any) => {
  try {
    // Call our supabase edge function
    const { data, error } = await supabase.functions.invoke('search-stocks', {
      body: { query }
    });

    if (error) throw error;

    dispatch({
      type: SEARCH_STOCKS,
      payload: data
    });
  } catch (err: any) {
    console.error('Search stocks error:', err);
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Get top gainers
export const getTopGainers = () => async (dispatch: any) => {
  try {
    // Call our supabase edge function
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { 
        type: 'gainers',
        limit: 5
      }
    });

    if (error) throw error;

    dispatch({
      type: GET_TOP_GAINERS,
      payload: data
    });
  } catch (err: any) {
    console.error('Get top gainers error:', err);
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Get top losers
export const getTopLosers = () => async (dispatch: any) => {
  try {
    // Call our supabase edge function
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: { 
        type: 'losers',
        limit: 5
      }
    });

    if (error) throw error;

    dispatch({
      type: GET_TOP_LOSERS,
      payload: data
    });
  } catch (err: any) {
    console.error('Get top losers error:', err);
    dispatch({
      type: STOCK_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Clear stock
export const clearStock = () => (dispatch: any) => {
  dispatch({ type: CLEAR_STOCK });
};
