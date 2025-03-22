
import { supabase } from '@/lib/supabase';
import { setAlert } from './alertActions';
import {
  GET_PORTFOLIO,
  BUY_STOCK,
  SELL_STOCK,
  GET_PERFORMANCE_HISTORY,
  PORTFOLIO_ERROR
} from './types';

// Get user portfolio
export const getPortfolio = () => async (dispatch: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user's portfolio data
    const { data: portfolio, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    // Get user's buying power
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('buying_power')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    const portfolioData = {
      totalValue: portfolio.reduce((total, item) => total + (item.shares * item.current_price), 0) + (profile?.buying_power || 0),
      buyingPower: profile?.buying_power || 0,
      positions: portfolio
    };

    dispatch({
      type: GET_PORTFOLIO,
      payload: portfolioData
    });
  } catch (err: any) {
    console.error('Get portfolio error:', err);
    dispatch({
      type: PORTFOLIO_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Buy stock
export const buyStock = (symbol: string, shares: number, price: number) => async (dispatch: any) => {
  try {
    // Call our supabase edge function to execute the transaction
    const { data, error } = await supabase.functions.invoke('execute-stock-transaction', {
      body: {
        symbol,
        transaction_type: 'buy',
        shares,
        price_per_share: price
      }
    });

    if (error) throw error;

    dispatch({
      type: BUY_STOCK,
      payload: data
    });

    dispatch(setAlert(`Successfully purchased ${shares} shares of ${symbol}`, 'success'));
  } catch (err: any) {
    console.error('Buy stock error:', err);
    dispatch(setAlert(err.message || 'Failed to purchase stock', 'danger'));
    
    dispatch({
      type: PORTFOLIO_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Sell stock
export const sellStock = (symbol: string, shares: number, price: number) => async (dispatch: any) => {
  try {
    // Call our supabase edge function to execute the transaction
    const { data, error } = await supabase.functions.invoke('execute-stock-transaction', {
      body: {
        symbol,
        transaction_type: 'sell',
        shares,
        price_per_share: price
      }
    });

    if (error) throw error;

    dispatch({
      type: SELL_STOCK,
      payload: data
    });

    dispatch(setAlert(`Successfully sold ${shares} shares of ${symbol}`, 'success'));
  } catch (err: any) {
    console.error('Sell stock error:', err);
    dispatch(setAlert(err.message || 'Failed to sell stock', 'danger'));
    
    dispatch({
      type: PORTFOLIO_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Get performance history
export const getPerformanceHistory = () => async (dispatch: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get portfolio performance history
    const { data, error } = await supabase
      .from('portfolio_history')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (error) throw error;

    dispatch({
      type: GET_PERFORMANCE_HISTORY,
      payload: data
    });
  } catch (err: any) {
    console.error('Get performance history error:', err);
    dispatch({
      type: PORTFOLIO_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};
