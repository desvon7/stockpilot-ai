
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PortfolioItem {
  id: string;
  symbol: string;
  company_name: string;
  shares: number;
  average_price: number;
  current_price?: number;
  total_value?: number;
  profit_loss?: number;
  profit_loss_percent?: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  company_name: string;
  transaction_type: 'buy' | 'sell';
  shares: number;
  price_per_share: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

// Define types for our RPC function parameters
export interface StockTransactionParams {
  p_symbol: string;
  p_company_name: string;
  p_transaction_type: 'buy' | 'sell';
  p_shares: number;
  p_price_per_share: number;
  p_total_amount: number;
}

export const getUserPortfolio = async (): Promise<PortfolioItem[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('symbol');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

export const getUserTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data as Transaction[]) || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const executeTransaction = async (
  symbol: string,
  companyName: string,
  transactionType: 'buy' | 'sell',
  shares: number,
  pricePerShare: number
): Promise<void> => {
  try {
    const totalAmount = shares * pricePerShare;
    
    const params: StockTransactionParams = {
      p_symbol: symbol,
      p_company_name: companyName,
      p_transaction_type: transactionType,
      p_shares: shares,
      p_price_per_share: pricePerShare,
      p_total_amount: totalAmount
    };
    
    // Fixed: Pass params as the second argument to rpc, not as spread properties
    const { error: transactionError } = await supabase.rpc(
      'execute_stock_transaction', 
      params
    );
    
    if (transactionError) throw transactionError;
    
  } catch (error) {
    console.error('Error executing transaction:', error);
    throw error;
  }
};

export const addToWatchlist = async (
  watchlistId: string,
  symbol: string,
  companyName: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('watchlist_items')
      .insert({
        watchlist_id: watchlistId,
        symbol,
        company_name: companyName
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const createWatchlist = async (name: string): Promise<string> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('watchlists')
      .insert({ 
        name,
        user_id: userId
      })
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating watchlist:', error);
    throw error;
  }
};

export const getUserWatchlists = async () => {
  try {
    const { data, error } = await supabase
      .from('watchlists')
      .select(`
        id,
        name,
        created_at,
        watchlist_items (
          id,
          symbol,
          company_name,
          created_at
        )
      `);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    throw error;
  }
};
