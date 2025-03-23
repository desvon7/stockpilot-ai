
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { WebSocketStatus } from '@/types/marketData';

interface StockHeaderProps {
  symbol: string;
  name: string;
  sector?: string;
  price: number;
  change: number;
  changePercent: number;
  realTime?: boolean;
  wsStatus?: WebSocketStatus;
}

const StockHeader: React.FC<StockHeaderProps> = ({ 
  symbol, 
  name, 
  sector, 
  price, 
  change, 
  changePercent,
  realTime = false,
  wsStatus
}) => {
  const isPositive = change >= 0;
  
  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };
  
  const formatChange = (num: number) => {
    return (num > 0 ? '+' : '') + formatPrice(num);
  };
  
  const formatPercent = (num: number) => {
    return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-2xl font-bold">{symbol}</h1>
        {realTime && (
          <Badge variant={wsStatus === 'connected' ? 'outline' : 'secondary'} className="ml-2">
            {wsStatus === 'connected' ? (
              <><Wifi className="h-3 w-3 mr-1 text-green-500" /> Live</>
            ) : (
              <><WifiOff className="h-3 w-3 mr-1 text-yellow-500" /> Delayed</>
            )}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-4">
        <span className="text-lg text-muted-foreground">{name}</span>
        {sector && (
          <>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-muted-foreground">{sector}</span>
          </>
        )}
      </div>
      
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(price)}</span>
        <div className={cn(
          "flex items-center gap-1",
          isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        )}>
          <span className="text-lg font-medium">{formatChange(change)}</span>
          <span className="text-lg font-medium">({formatPercent(changePercent)})</span>
          {isPositive ? 
            <ArrowUpCircle className="h-5 w-5" /> : 
            <ArrowDownCircle className="h-5 w-5" />
          }
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
