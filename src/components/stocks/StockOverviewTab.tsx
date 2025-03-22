
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercent, formatLargeCurrency } from '@/utils/formatters';

interface StockData {
  symbol: string;
  name: string;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  beta: number;
  yearHigh: number;
  yearLow: number;
  volume: number;
  industry: string;
  sector: string;
}

interface StockOverviewTabProps {
  stockData: StockData;
}

const StockOverviewTab: React.FC<StockOverviewTabProps> = ({ stockData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
        <CardDescription>Key metrics and information about {stockData.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatLargeCurrency(stockData.marketCap)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">P/E Ratio</p>
            <p className="font-medium">{stockData.peRatio}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">EPS</p>
            <p className="font-medium">{formatCurrency(stockData.eps)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dividend Yield</p>
            <p className="font-medium">{formatPercent(stockData.dividendYield / 100)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Beta</p>
            <p className="font-medium">{stockData.beta}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">52w High</p>
            <p className="font-medium">{formatCurrency(stockData.yearHigh)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">52w Low</p>
            <p className="font-medium">{formatCurrency(stockData.yearLow)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="font-medium">{stockData.volume.toLocaleString()}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="font-medium mb-2">About {stockData.name}</h3>
          <p className="text-muted-foreground">
            {stockData.name} is a leading company in the {stockData.industry} industry, 
            part of the broader {stockData.sector} sector. The company is known for its 
            innovative products and services, with a strong focus on research and development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockOverviewTab;
