import { supabase } from '@/lib/supabase';
import { setAlert } from './alertActions';
import {
  GET_WATCHLISTS,
  CREATE_WATCHLIST,
  UPDATE_WATCHLIST,
  DELETE_WATCHLIST,
  ADD_STOCK_TO_WATCHLIST,
  REMOVE_STOCK_FROM_WATCHLIST,
  WATCHLIST_ERROR
} from './types';

// Get all watchlists
export const getWatchlists = () => async (dispatch: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all watchlists for the user
    const { data, error } = await supabase
      .from('watchlists')
      .select('*, watchlist_items(*)')
      .eq('user_id', user.id);

    if (error) throw error;

    dispatch({
      type: GET_WATCHLISTS,
      payload: data
    });
  } catch (err: any) {
    console.error('Get watchlists error:', err);
    dispatch({
      type: WATCHLIST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Create watchlist
export const createWatchlist = (name: string) => async (dispatch: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create new watchlist
    const { data, error } = await supabase
      .from('watchlists')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;

    dispatch({
      type: CREATE_WATCHLIST,
      payload: data
    });

    dispatch(setAlert('Watchlist created', 'success'));
  } catch (err: any) {
    console.error('Create watchlist error:', err);
    dispatch(setAlert(err.message || 'Failed to create watchlist', 'danger'));
    
    dispatch({
      type: WATCHLIST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Update watchlist
export const updateWatchlist = (id: string, name: string) => async (dispatch: any) => {
  try {
    // Update watchlist name
    const { data, error } = await supabase
      .from('watchlists')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    dispatch({
      type: UPDATE_WATCHLIST,
      payload: data
    });

    dispatch(setAlert('Watchlist updated', 'success'));
  } catch (err: any) {
    console.error('Update watchlist error:', err);
    dispatch(setAlert(err.message || 'Failed to update watchlist', 'danger'));
    
    dispatch({
      type: WATCHLIST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Delete watchlist
export const deleteWatchlist = (id: string) => async (dispatch: any) => {
  try {
    // Delete watchlist
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('id', id);

    if (error) throw error;

    dispatch({
      type: DELETE_WATCHLIST,
      payload: id
    });

    dispatch(setAlert('Watchlist removed', 'success'));
  } catch (err: any) {
    console.error('Delete watchlist error:', err);
    dispatch({
      type: WATCHLIST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Add stock to watchlist
export const addStockToWatchlist = (watchlistId: string, symbol: string) => async (dispatch: any) => {
  try {
    // First get company name from stock data (mock for now)
    const companyName = `${symbol} Company`; // In a real app, we would fetch this from an API
    
    // Add stock to watchlist with company name
    const { data, error } = await supabase
      .from('watchlist_items')
      .insert({ 
        watchlist_id: watchlistId, 
        symbol,
        company_name: companyName
      })
      .select('*, watchlists(*)')
      .single();

    if (error) throw error;

    dispatch({
      type: ADD_STOCK_TO_WATCHLIST,
      payload: data
    });

    dispatch(setAlert(`${symbol} added to watchlist`, 'success'));
  } catch (err: any) {
    console.error('Add to watchlist error:', err);
    
    if (err.message.includes('duplicate key')) {
      dispatch(setAlert(`${symbol} is already in this watchlist`, 'warning'));
    } else {
      dispatch(setAlert(err.message || 'Failed to add stock to watchlist', 'danger'));
    }
    
    dispatch({
      type: WATCHLIST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};

// Remove stock from watchlist
export const removeStockFromWatchlist = (watchlistId: string, itemId: string) => async (dispatch: any) => {
  try {
    // Remove stock from watchlist
    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('id', itemId)
      .eq('watchlist_id', watchlistId);

    if (error) throw error;

    dispatch({
      type: REMOVE_STOCK_FROM_WATCHLIST,
      payload: {
        watchlistId,
        itemId
      }
    });

    dispatch(setAlert('Stock removed from watchlist', 'success'));
  } catch (err: any) {
    console.error('Remove stock from watchlist error:', err);
    dispatch({
      type: WATCHLIST_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};
