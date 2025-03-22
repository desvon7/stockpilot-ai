
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import AddToWatchlist from '@/components/watchlists/AddToWatchlist';
import { useToast } from '@/components/ui/use-toast';

interface StockTradingCardProps {
  symbol: string;
}

const StockTradingCard: React.FC<StockTradingCardProps> = ({ symbol }) => {
  const { toast } = useToast();

  const handleBuyStock = () => {
    toast({
      title: "Order Placed",
      description: `Your order to buy ${symbol} has been placed`,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Trade</CardTitle>
        <CardDescription>Buy or sell {symbol} shares</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            className="w-full"
            onClick={handleBuyStock}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Buy {symbol}
          </Button>
          <AddToWatchlist stockSymbol={symbol} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StockTradingCard;
