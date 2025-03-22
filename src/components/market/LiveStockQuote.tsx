
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, getColorByChange } from '@/utils/formatters';
import { Link } from 'react-router-dom';

interface LiveStockQuoteProps {
  symbol: string;
  price: number;
  previousClose?: number;
  bid?: number;
  ask?: number;
  volume?: number;
  change?: number;
  changePercent?: number;
  isLoading?: boolean;
  className?: string;
  lastUpdated?: Date;
}

const LiveStockQuote: React.FC<LiveStockQuoteProps> = ({
  symbol,
  price,
  previousClose,
  bid,
  ask,
  volume,
  change: propChange,
  changePercent: propChangePercent,
  isLoading = false,
  className,
  lastUpdated
}) => {
  const [priceFlash, setPriceFlash] = useState<'none' | 'increase' | 'decrease'>('none');
  const prevPriceRef = useRef<number>(price);
  
  // Calculate change values if we have previous close data and it's not provided as props
  const change = propChange !== undefined 
    ? propChange 
    : (previousClose ? price - previousClose : 0);
    
  const changePercent = propChangePercent !== undefined 
    ? propChangePercent 
    : (previousClose ? (change / previousClose) * 100 : 0);
    
  const isPositive = change >= 0;

  // Flash animation when price changes
  useEffect(() => {
    if (price === prevPriceRef.current || isLoading) return;
    
    const newFlash = price > prevPriceRef.current ? 'increase' : 'decrease';
    setPriceFlash(newFlash);
    
    prevPriceRef.current = price;
    
    // Reset flash after animation completes
    const timeout = setTimeout(() => {
      setPriceFlash('none');
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [price, isLoading]);

  return (
    <Link to={`/stocks/${symbol}`} className="block">
      <div className={cn(
        "p-4 border rounded-lg transition-all hover:shadow-md",
        isPositive ? "border-green-200 bg-green-50/50 dark:bg-green-950/10" : "border-red-200 bg-red-50/50 dark:bg-red-950/10",
        className
      )}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-1">
            {symbol}
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </h3>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        
        <div className={cn(
          "text-xl font-bold mb-2 transition-colors",
          priceFlash === 'increase' && "text-green-500 animate-price-up",
          priceFlash === 'decrease' && "text-red-500 animate-price-down"
        )}>
          {formatCurrency(price)}
        </div>
        
        <div className={cn(
          "flex items-center text-sm",
          getColorByChange(change)
        )}>
          {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          <span>{formatCurrency(Math.abs(change))}</span>
          <span className="ml-1">({changePercent.toFixed(2)}%)</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
          {(bid || ask) && (
            <>
              {bid !== undefined && (
                <div>
                  <span className="block">Bid</span>
                  <span>{formatCurrency(bid)}</span>
                </div>
              )}
              {ask !== undefined && (
                <div>
                  <span className="block">Ask</span>
                  <span>{formatCurrency(ask)}</span>
                </div>
              )}
            </>
          )}
          
          {volume !== undefined && (
            <div className="col-span-2 mt-1">
              <span className="block">Volume</span>
              <span>{volume.toLocaleString()}</span>
            </div>
          )}
          
          {lastUpdated && (
            <div className="col-span-2 mt-1 text-[10px]">
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LiveStockQuote;
