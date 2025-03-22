
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
      .from('portfolios')
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

    // Calculate total portfolio value
    const totalValue = portfolio.reduce(
      (total: number, item: any) => total + (item.shares * item.average_price), 0
    ) + (profile?.buying_power || 0);

    const portfolioData = {
      totalValue,
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

// Get performance history - We'll use a mock implementation since there's no portfolio_history table
export const getPerformanceHistory = () => async (dispatch: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate mock performance history data
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    const mockHistory = [];
    let currentValue = 10000;
    
    for (let i = 0; i <= 30; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dailyChange = (Math.random() - 0.45) * (currentValue * 0.02);
      currentValue += dailyChange;
      
      mockHistory.push({
        date: currentDate.toISOString().split('T')[0],
        value: currentValue
      });
    }

    dispatch({
      type: GET_PERFORMANCE_HISTORY,
      payload: mockHistory
    });
  } catch (err: any) {
    console.error('Get performance history error:', err);
    dispatch({
      type: PORTFOLIO_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};
