
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  ArrowDownUp,
  Loader2
} from 'lucide-react';
import AddToWatchlist from '@/components/watchlists/AddToWatchlist';
import usePortfolio from '@/hooks/usePortfolio';
import { useStockData } from '@/hooks/useStockData';
import { toast } from 'sonner';

interface StockTradingCardProps {
  symbol: string;
  companyName?: string;
}

const StockTradingCard: React.FC<StockTradingCardProps> = ({ 
  symbol, 
  companyName = ''
}) => {
  const [shares, setShares] = useState<string>('1');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  
  const { data: stockData, isLoading: isLoadingStock } = useStockData(symbol);
  const { 
    buyStock, 
    sellStock, 
    isBuying, 
    isSelling, 
    portfolio 
  } = usePortfolio();

  // Find if user already owns shares of this stock
  const ownedStock = portfolio?.find(item => item.symbol === symbol);
  const currentPrice = stockData?.price || 0;
  const estimatedTotal = parseFloat(shares) * currentPrice;
  
  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow positive numbers with up to 2 decimal places
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setShares(value);
    }
  };

  const handleOrderSubmit = () => {
    if (!currentPrice) {
      toast.error("Unable to execute trade: current price is unavailable");
      return;
    }
    
    const sharesNum = parseFloat(shares);
    if (isNaN(sharesNum) || sharesNum <= 0) {
      toast.error("Please enter a valid number of shares");
      return;
    }

    const stockName = companyName || stockData?.name || symbol;
    
    if (orderType === 'buy') {
      buyStock({
        symbol,
        companyName: stockName,
        shares: sharesNum,
        pricePerShare: currentPrice
      });
    } else {
      // Check if user has enough shares to sell
      if (!ownedStock || ownedStock.shares < sharesNum) {
        toast.error(`You don't own enough shares of ${symbol} to sell ${shares} shares`);
        return;
      }
      
      sellStock({
        symbol,
        companyName: stockName,
        shares: sharesNum,
        pricePerShare: currentPrice
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Trade {symbol}</CardTitle>
        <CardDescription>
          {orderType === 'buy' ? 'Buy' : 'Sell'} {symbol} shares at market price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Price:</span>
            {isLoadingStock ? (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Loading...
              </div>
            ) : (
              <span className="font-bold">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          
          {ownedStock && (
            <div className="flex justify-between items-center bg-muted p-2 rounded-md">
              <span className="text-sm font-medium">You own:</span>
              <span className="font-medium">{ownedStock.shares} shares</span>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-3">
            <Select 
              defaultValue="buy" 
              onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Shares"
                value={shares}
                onChange={handleSharesChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-sm font-medium">Estimated Total:</span>
            <span className="font-bold">
              ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          <Button 
            className="w-full"
            onClick={handleOrderSubmit}
            disabled={isBuying || isSelling || isLoadingStock || !shares}
          >
            {(isBuying || isSelling) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : orderType === 'buy' ? (
              <>
                <DollarSign className="h-4 w-4 mr-2" />
                Buy {shares} Shares
              </>
            ) : (
              <>
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Sell {shares} Shares
              </>
            )}
          </Button>
          
          <AddToWatchlist stockSymbol={symbol} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col text-xs text-muted-foreground">
        <div className="flex items-start">
          <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
          <p>Market orders execute at current market price. Prices may vary slightly from displayed quote.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StockTradingCard;
