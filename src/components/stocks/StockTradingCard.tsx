
import React, { useState } from 'react';
import OrderForm from '@/components/orders/OrderForm';
import AddToWatchlist from '@/components/watchlists/AddToWatchlist';
import useStockTrading from '@/hooks/useStockTrading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock } from 'lucide-react';
import InsufficientFundsModal from '@/components/orders/InsufficientFundsModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StockTradingCardProps {
  symbol: string;
  companyName?: string;
  currentPrice?: number; // Added currentPrice as an optional prop
}

const StockTradingCard: React.FC<StockTradingCardProps> = ({ 
  symbol, 
  companyName = '',
  currentPrice // Add to parameter list
}) => {
  const { currentPrice: hookCurrentPrice, ownedStock, handleOrderSuccess, isLoadingStock } = useStockTrading({ symbol });
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const { user } = useAuth();
  const [buyingPower, setBuyingPower] = useState(0);

  // Use the prop value if provided, otherwise use the value from the hook
  const finalCurrentPrice = currentPrice !== undefined ? currentPrice : hookCurrentPrice;

  // Fetch user's buying power on component mount
  React.useEffect(() => {
    const fetchBuyingPower = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('buying_power')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setBuyingPower(data?.buying_power || 0);
      } catch (error) {
        console.error('Error fetching buying power:', error);
      }
    };

    fetchBuyingPower();
  }, [user]);

  const handleInsufficientFunds = (amount: number) => {
    setRequiredAmount(amount);
    setShowInsufficientFundsModal(true);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Trade {symbol}</span>
          {ownedStock && (
            <Badge variant="outline" className="ml-2">
              {ownedStock.shares} shares owned
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              currentPrice={finalCurrentPrice}
              availableShares={ownedStock?.shares}
              onOrderSuccess={handleOrderSuccess}
              onInsufficientFunds={handleInsufficientFunds}
            />
          </TabsContent>
          <TabsContent value="limit">
            <OrderForm
              symbol={symbol}
              companyName={companyName}
              currentPrice={finalCurrentPrice}
              availableShares={ownedStock?.shares}
              onOrderSuccess={handleOrderSuccess}
              onInsufficientFunds={handleInsufficientFunds}
              orderType="limit"
            />
          </TabsContent>
        </Tabs>
        
        <AddToWatchlist stockSymbol={symbol} />

        <InsufficientFundsModal
          open={showInsufficientFundsModal}
          onOpenChange={setShowInsufficientFundsModal}
          availableFunds={buyingPower}
          requiredAmount={requiredAmount}
          onDismiss={() => setShowInsufficientFundsModal(false)}
        />
      </CardContent>
    </Card>
  );
};

export default StockTradingCard;
