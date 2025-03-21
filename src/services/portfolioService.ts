import { supabase } from '@/integrations/supabase/client';

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

export interface StockTransactionParams {
  p_symbol: string;
  p_company_name: string;
  p_transaction_type: 'buy' | 'sell';
  p_shares: number;
  p_price_per_share: number;
  p_total_amount: number;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  company_name: string;
  created_at: string;
  current_price?: number;
  price_change?: number;
  price_change_percent?: number;
}

export interface Watchlist {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  watchlist_items: WatchlistItem[];
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
    
    const { error: transactionError } = await supabase.functions.invoke(
      'execute-stock-transaction',
      {
        body: params
      }
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

export const getUserWatchlists = async (): Promise<Watchlist[]> => {
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

export const getWatchlistStockPrices = async (symbols: string[]): Promise<Record<string, { price: number, change: number, changePercent: number }>> => {
  if (!symbols.length) return {};
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch-watchlist-prices', {
      body: { symbols }
    });
    
    if (error) throw error;
    return data || {};
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return {};
  }
};

export const deleteWatchlist = async (watchlistId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('id', watchlistId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (watchlistItemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('id', watchlistItemId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export interface PortfolioHistoryItem {
  date: string;
  totalValue: number;
  cashValue: number;
  stocksValue: number;
}

export interface SectorAllocation {
  name: string;
  value: number;
  percentage: number;
}

export const getPortfolioHistory = async (): Promise<PortfolioHistoryItem[]> => {
  try {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    const result: PortfolioHistoryItem[] = [];
    let currentValue = 10000;
    
    for (let i = 0; i <= 365; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dailyChange = (Math.random() - 0.48) * (currentValue * 0.02);
      currentValue += dailyChange;
      
      const stocksValue = currentValue * 0.7;
      const cashValue = currentValue * 0.3;
      
      result.push({
        date: currentDate.toISOString().split('T')[0],
        totalValue: currentValue,
        cashValue,
        stocksValue
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    throw error;
  }
};

export const getPortfolioSectors = async (): Promise<SectorAllocation[]> => {
  try {
    const mockSectors = [
      { name: 'Technology', value: 12500, percentage: 25 },
      { name: 'Healthcare', value: 8750, percentage: 17.5 },
      { name: 'Financial Services', value: 7500, percentage: 15 },
      { name: 'Consumer Cyclical', value: 6250, percentage: 12.5 },
      { name: 'Communication Services', value: 5000, percentage: 10 },
      { name: 'Industrials', value: 3750, percentage: 7.5 },
      { name: 'Energy', value: 2500, percentage: 5 },
      { name: 'Materials', value: 2500, percentage: 5 },
      { name: 'Real Estate', value: 1250, percentage: 2.5 }
    ];
    
    return mockSectors;
  } catch (error) {
    console.error('Error fetching portfolio sectors:', error);
    throw error;
  }
};
