
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle, Clock, Wifi, WifiOff } from 'lucide-react';
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
  maxItems?: number;
}

const LiveWatchlist: React.FC<LiveWatchlistProps> = ({ 
  symbols, 
  title = "Watchlist",
  onAddSymbol,
  className,
  maxItems 
}) => {
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const updateTimerRef = useRef<number | null>(null);
  
  const { 
    quotes, 
    trades,
    isLoading, 
    wsStatus, 
    refresh 
  } = useRealTimeMarketData({ 
    symbols,
    onQuoteUpdate: () => {
      // Update the last updated time when we receive new data
      setLastUpdated(new Date());
      
      // Clear any existing timer
      if (updateTimerRef.current) {
        window.clearTimeout(updateTimerRef.current);
      }
      
      // Set a timer to update the timestamp every 10 seconds if no data comes in
      updateTimerRef.current = window.setTimeout(() => {
        setLastUpdated(new Date());
      }, 10000);
    }
  });
  
  // Clean up the timer on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        window.clearTimeout(updateTimerRef.current);
      }
    };
  }, []);
  
  const handleAddStock = (stock: StockSearchResult) => {
    if (onAddSymbol) {
      onAddSymbol(stock.symbol);
    }
    setIsAddingStock(false);
  };

  // Limit the number of symbols shown if maxItems is specified
  const displaySymbols = maxItems ? symbols.slice(0, maxItems) : symbols;

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            {title}
            {wsStatus === 'connected' ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
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
          Last updated: {format(lastUpdated, 'hh:mm:ss a')}
          <span className="ml-2">
            {wsStatus === 'connected' ? (
              <span className="text-green-500">●</span>
            ) : wsStatus === 'connecting' ? (
              <span className="text-yellow-500">●</span>
            ) : (
              <span className="text-red-500">●</span>
            )}
            <span className="ml-1 text-muted-foreground">
              {wsStatus === 'connected' ? 'Live' : 
               wsStatus === 'connecting' ? 'Connecting...' : 
               wsStatus === 'disconnected' ? 'Disconnected' : 'Error'}
            </span>
          </span>
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
          {displaySymbols.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No symbols in watchlist. Add some to see real-time quotes.
            </div>
          ) : (
            displaySymbols.map(symbol => {
              const quote = quotes[symbol];
              const trade = trades[symbol];
              
              return (
                <LiveStockQuote
                  key={symbol}
                  symbol={symbol}
                  price={quote?.price || 0}
                  previousClose={quote?.previousClose}
                  bid={quote?.bid}
                  ask={quote?.ask}
                  volume={quote?.volume}
                  change={quote?.change}
                  changePercent={quote?.changePercent}
                  isLoading={isLoading && !quote}
                  lastUpdated={quote ? new Date(quote.timestamp) : undefined}
                />
              );
            })
          )}
        </div>
        
        {maxItems && symbols.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => {}}>
              View All {symbols.length} Symbols
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1 text-xs text-muted-foreground border-t">
        <p>Data provided by Alpaca Markets</p>
      </CardFooter>
    </Card>
  );
};

export default LiveWatchlist;
