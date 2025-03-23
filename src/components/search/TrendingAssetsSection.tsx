
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface TrendingAssetsSectionProps {
  onSelectStock: (symbol: string) => void;
}

const TrendingAssetsSection: React.FC<TrendingAssetsSectionProps> = ({ onSelectStock }) => {
  const navigate = useNavigate();
  
  const trendingStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' }
  ];

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
              className="p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => onSelectStock(stock.symbol)}
            >
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-muted-foreground">{stock.name}</div>
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
              className="p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => onSelectStock(etf.symbol)}
            >
              <div className="font-medium flex items-center gap-1">
                {etf.symbol}
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ETF</Badge>
              </div>
              <div className="text-sm text-muted-foreground">{etf.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/stocks')}
          className="w-full"
        >
          Browse All Assets
        </Button>
      </div>
    </div>
  );
};

export default TrendingAssetsSection;
