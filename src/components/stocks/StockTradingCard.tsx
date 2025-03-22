
import React from 'react';
import OrderForm from '@/components/orders/OrderForm';
import AddToWatchlist from '@/components/watchlists/AddToWatchlist';
import usePortfolio from '@/hooks/usePortfolio';
import { useStockData } from '@/hooks/useStockData';

interface StockTradingCardProps {
  symbol: string;
  companyName?: string;
}

const StockTradingCard: React.FC<StockTradingCardProps> = ({ 
  symbol, 
  companyName = ''
}) => {
  const { data: stockData, isLoading: isLoadingStock, refreshData } = useStockData(symbol);
  const { portfolio, refetch: refetchPortfolio } = usePortfolio();
  
  // Find if user already owns shares of this stock
  const ownedStock = portfolio?.find(item => item.symbol === symbol);
  const currentPrice = stockData?.price || 0;

  const handleOrderSuccess = () => {
    // Refresh both the portfolio and stock data
    refetchPortfolio();
    refreshData();
  };

  return (
    <div className="space-y-4">
      <OrderForm
        symbol={symbol}
        companyName={companyName}
        currentPrice={currentPrice}
        availableShares={ownedStock?.shares}
        onOrderSuccess={handleOrderSuccess}
      />
      
      <AddToWatchlist stockSymbol={symbol} />
    </div>
  );
};

export default StockTradingCard;
