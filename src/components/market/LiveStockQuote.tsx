
import React from 'react';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, getColorByChange } from '@/utils/formatters';

interface LiveStockQuoteProps {
  symbol: string;
  price: number;
  previousClose?: number;
  bid?: number;
  ask?: number;
  isLoading?: boolean;
  className?: string;
}

const LiveStockQuote: React.FC<LiveStockQuoteProps> = ({
  symbol,
  price,
  previousClose,
  bid,
  ask,
  isLoading = false,
  className
}) => {
  // Calculate change values if we have previous close data
  const change = previousClose ? price - previousClose : 0;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className={cn(
      "p-4 border rounded-lg transition-all",
      isPositive ? "border-green-200 bg-green-50/50 dark:bg-green-950/10" : "border-red-200 bg-red-50/50 dark:bg-red-950/10",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{symbol}</h3>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      
      <div className="text-xl font-bold mb-2">
        {formatCurrency(price)}
      </div>
      
      {previousClose && (
        <div className={cn(
          "flex items-center text-sm",
          getColorByChange(change)
        )}>
          {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          <span>{formatCurrency(Math.abs(change))}</span>
          <span className="ml-1">({changePercent.toFixed(2)}%)</span>
        </div>
      )}
      
      {(bid || ask) && (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
          {bid && (
            <div>
              <span className="block">Bid</span>
              <span>{formatCurrency(bid)}</span>
            </div>
          )}
          {ask && (
            <div>
              <span className="block">Ask</span>
              <span>{formatCurrency(ask)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveStockQuote;
