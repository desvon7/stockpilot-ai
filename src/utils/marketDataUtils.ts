
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const fetchMarketPrices = async (symbols: string[]): Promise<Record<string, number>> => {
  if (!symbols || symbols.length === 0) return {};
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch-portfolio-prices', {
      body: { symbols }
    });
    
    if (error) {
      console.error('Error fetching market prices:', error);
      return {};
    }
    
    // Convert the data to a simple symbol -> price map
    const priceMap: Record<string, number> = {};
    
    Object.entries(data || {}).forEach(([symbol, details]) => {
      if (typeof details === 'object' && details && 'price' in details) {
        priceMap[symbol] = (details as any).price;
      }
    });
    
    return priceMap;
  } catch (err) {
    console.error('Error in fetchMarketPrices:', err);
    return {};
  }
};

export const enrichPortfolioWithMarketData = async (portfolio: any[]) => {
  if (!portfolio || portfolio.length === 0) return portfolio;
  
  // Extract all symbols
  const symbols = portfolio.map(item => item.symbol);
  
  try {
    // Fetch current prices
    const priceMap = await fetchMarketPrices(symbols);
    
    // Enrich portfolio items with current prices and calculated fields
    return portfolio.map(item => {
      const currentPrice = priceMap[item.symbol] || item.average_price;
      const totalValue = item.shares * currentPrice;
      const costBasis = item.shares * item.average_price;
      const profitLoss = totalValue - costBasis;
      const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
      
      return {
        ...item,
        current_price: currentPrice,
        total_value: totalValue,
        profit_loss: profitLoss,
        profit_loss_percent: profitLossPercent
      };
    });
  } catch (err) {
    console.error('Error enriching portfolio with market data:', err);
    return portfolio;
  }
};
