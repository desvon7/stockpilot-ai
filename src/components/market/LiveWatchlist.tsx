
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle, Clock } from 'lucide-react';
import LiveStockQuote from './LiveStockQuote';
import useRealTimeMarketData from '@/hooks/useRealTimeMarketData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import StockSearch from '@/components/ui/StockSearch';
import { StockSearchResult } from '@/services/stockService';

interface LiveWatchlistProps {
  symbols: string[];
  title?: string;
  onAddSymbol?: (symbol: string) => void;
  className?: string;
}

const LiveWatchlist: React.FC<LiveWatchlistProps> = ({ 
  symbols, 
  title = "Watchlist",
  onAddSymbol,
  className 
}) => {
  const [isAddingStock, setIsAddingStock] = useState(false);
  const { 
    quotes, 
    isLoading, 
    wsStatus, 
    refresh 
  } = useRealTimeMarketData({ symbols });
  
  const handleAddStock = (stock: StockSearchResult) => {
    if (onAddSymbol) {
      onAddSymbol(stock.symbol);
    }
    setIsAddingStock(false);
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            {title}
            <span className={cn(
              "ml-2 h-2 w-2 rounded-full",
              wsStatus === 'connected' ? "bg-green-500" :
              wsStatus === 'connecting' ? "bg-yellow-500" :
              "bg-red-500"
            )} />
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAddingStock(!isAddingStock)} 
              className="h-8 w-8 p-0"
              title="Add symbol"
            >
              <PlusCircle size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh} 
              disabled={isLoading}
              className="h-8 w-8 p-0"
              title="Refresh"
            >
              <RefreshCw size={16} className={cn(isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {format(new Date(), 'hh:mm:ss a')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAddingStock && (
          <div className="mb-4">
            <StockSearch
              onSelectStock={handleAddStock}
              isLoading={isLoading}
              buttonText="Add to Watchlist"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {symbols.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No symbols in watchlist. Add some to see real-time quotes.
            </div>
          ) : (
            symbols.map(symbol => {
              const quote = quotes[symbol];
              
              return (
                <LiveStockQuote
                  key={symbol}
                  symbol={symbol}
                  price={quote?.price || 0}
                  previousClose={quote?.previousClose}
                  bid={quote?.bid}
                  ask={quote?.ask}
                  isLoading={isLoading && !quote}
                />
              );
            })
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1 text-xs text-muted-foreground border-t">
        <p>Data provided by Alpaca Markets</p>
      </CardFooter>
    </Card>
  );
};

export default LiveWatchlist;
