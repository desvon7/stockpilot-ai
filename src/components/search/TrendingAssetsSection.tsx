
import React, { useEffect, useState } from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { fetchTrendingStocks } from '@/services/marketDataService';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface TrendingAssetsSectionProps {
  onSelectStock: (symbol: string) => void;
}

interface TrendingStock {
  symbol: string;
  name: string;
  price?: number;
  change_percent?: number;
}

const TrendingAssetsSection: React.FC<TrendingAssetsSectionProps> = ({ onSelectStock }) => {
  const navigate = useNavigate();
  const [trendingStocks, setTrendingStocks] = useState<TrendingStock[]>([
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrendingStocks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTrendingStocks();
        if (data && data.length > 0) {
          setTrendingStocks(data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to load trending stocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingStocks();
  }, []);

  const popularEtfs = [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' }
  ];
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Trending Stocks
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {trendingStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
              onClick={() => onSelectStock(stock.symbol)}
            >
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-muted-foreground truncate">{stock.name}</div>
              {stock.price && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm">{formatCurrency(stock.price)}</span>
                  {stock.change_percent !== undefined && (
                    <span className={cn(
                      "text-xs flex items-center",
                      stock.change_percent >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {stock.change_percent >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {formatPercent(Math.abs(stock.change_percent))}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Popular ETFs
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {popularEtfs.map((etf) => (
            <div
              key={etf.symbol}
              className="p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
              onClick={() => onSelectStock(etf.symbol)}
            >
              <div className="font-medium flex items-center gap-1">
                {etf.symbol}
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ETF</Badge>
              </div>
              <div className="text-sm text-muted-foreground truncate">{etf.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/account/stocks')}
          className="w-full"
        >
          Browse All Assets
        </Button>
      </div>
    </div>
  );
};

export default TrendingAssetsSection;
