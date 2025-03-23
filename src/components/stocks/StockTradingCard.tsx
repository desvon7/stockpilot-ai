
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock } from 'lucide-react';
import OrderForm from '@/components/orders/OrderForm';
import AddToWatchlist from '@/components/watchlists/AddToWatchlist';
import useStockTrading from '@/hooks/useStockTrading';
import InsufficientFundsModal from '@/components/orders/InsufficientFundsModal';
import { useIsMobile } from '@/hooks/use-mobile';

interface StockTradingCardProps {
  symbol: string;
  companyName?: string;
}

const StockTradingCard: React.FC<StockTradingCardProps> = ({ 
  symbol, 
  companyName = ''
}) => {
  const { currentPrice, ownedStock, handleOrderSuccess, isLoadingStock } = useStockTrading({ symbol });
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const isMobile = useIsMobile();
  
  // Memoize the available shares to reduce unnecessary re-renders
  const availableShares = useMemo(() => ownedStock?.shares || 0, [ownedStock]);

  const handleInsufficientFunds = (amount: number) => {
    setRequiredAmount(amount);
    setShowInsufficientFundsModal(true);
  };

  return (
    <Card className="shadow-md transition-all">
      <CardHeader className={`pb-2 ${isMobile ? 'px-4 py-3' : ''}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-medium flex items-center justify-between`}>
          <span>Trade {symbol}</span>
          {ownedStock && (
            <Badge variant="outline" className="ml-2">
              {ownedStock.shares} shares owned
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className={isMobile ? 'p-3' : ''}>
        <Tabs defaultValue="market" className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Market Order
            </TabsTrigger>
            <TabsTrigger value="limit" className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Limit Order
            </TabsTrigger>
          </TabsList>
          <TabsContent value="market">
            <OrderForm
              symbol={symbol}
              companyName={companyName}
              currentPrice={currentPrice}
              availableShares={availableShares}
              onOrderSuccess={handleOrderSuccess}
            />
          </TabsContent>
          <TabsContent value="limit">
            <OrderForm
              symbol={symbol}
              companyName={companyName}
              currentPrice={currentPrice}
              availableShares={availableShares}
              onOrderSuccess={handleOrderSuccess}
            />
          </TabsContent>
        </Tabs>
        
        <AddToWatchlist stockSymbol={symbol} />

        <InsufficientFundsModal
          open={showInsufficientFundsModal}
          onOpenChange={setShowInsufficientFundsModal}
          availableFunds={0} // This should come from a user context
          requiredAmount={requiredAmount}
          onDismiss={() => setShowInsufficientFundsModal(false)}
        />
      </CardContent>
    </Card>
  );
};

export default React.memo(StockTradingCard);
