
import React from 'react';
import OrderForm from '@/components/orders/OrderForm';
import AddToWatchlist from '@/components/watchlists/AddToWatchlist';
import useStockTrading from '@/hooks/useStockTrading';

interface StockTradingCardProps {
  symbol: string;
  companyName?: string;
}

const StockTradingCard: React.FC<StockTradingCardProps> = ({ 
  symbol, 
  companyName = ''
}) => {
  const { currentPrice, ownedStock, handleOrderSuccess } = useStockTrading({ symbol });

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
