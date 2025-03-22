
import React from 'react';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MarketIndexItem {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface MarketOverviewProps {
  indices: MarketIndexItem[];
  lastUpdated: string;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ indices, lastUpdated }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Market Overview</CardTitle>
        <CardDescription>Last updated: {lastUpdated}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indices.map((index, i) => (
            <div key={index.name} className={`flex items-center justify-between ${i < indices.length - 1 ? 'border-b border-border pb-3' : ''}`}>
              <div>
                <p className="font-medium">{index.name}</p>
                <p className="text-lg">{index.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className={`text-right ${index.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <div className="flex items-center">
                  {index.change >= 0 ? 
                    <TrendingUp className="h-4 w-4 mr-1" /> : 
                    <TrendingDown className="h-4 w-4 mr-1" />
                  }
                  <span>
                    {index.change >= 0 ? '+' : ''}{index.change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p>
                  {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full flex items-center justify-center">
          <ExternalLink className="h-4 w-4 mr-2" />
          View More Markets
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MarketOverview;
