
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, TrendingUp, Wallet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import StockChart from '@/components/ui/StockChart';

interface PortfolioSummaryCardProps {
  portfolioSummary: {
    value: number;
    change: number;
    changePercent: number;
    buyingPower: number;
    totalGain: number;
    totalGainPercent: number;
  };
  chartData: { date: string; price: number }[];
}

const PortfolioSummaryCard: React.FC<PortfolioSummaryCardProps> = ({
  portfolioSummary,
  chartData
}) => {
  return (
    <Card className="bg-card shadow-lg border-none overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Value and Chart */}
          <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-muted-foreground">Total Portfolio Value</div>
                <div className="text-4xl font-bold mt-1">{formatCurrency(portfolioSummary.value)}</div>
                <div className={cn("flex items-center mt-1", portfolioSummary.change >= 0 ? "text-green-500" : "text-red-500")}>
                  {portfolioSummary.change >= 0 ? 
                    <ArrowUp className="h-4 w-4 mr-1" /> : 
                    <ArrowDown className="h-4 w-4 mr-1" />
                  }
                  <span>{formatCurrency(Math.abs(portfolioSummary.change))}</span>
                  <span className="ml-1">({formatPercent(Math.abs(portfolioSummary.changePercent))})</span>
                  <span className="ml-2 text-muted-foreground text-sm">Today</span>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  Deposit
                  <ArrowUp className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="default" size="sm">
                  Trade
                  <TrendingUp className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="h-64 mt-6">
              <StockChart 
                data={chartData} 
                positiveChange={portfolioSummary.change >= 0} 
                minimal={false} 
              />
            </div>
          </div>
          
          {/* Stats and Quick Actions */}
          <div className="p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Portfolio Statistics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Buying Power</span>
                  <span className="font-medium">{formatCurrency(portfolioSummary.buyingPower)}</span>
                </div>
                <Progress value={portfolioSummary.buyingPower / (portfolioSummary.value + portfolioSummary.buyingPower) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">All-time Return</span>
                  <span className={cn("font-medium", getColorByChange(portfolioSummary.totalGain))}>
                    {portfolioSummary.totalGain >= 0 ? '+' : ''}
                    {formatPercent(portfolioSummary.totalGainPercent)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div 
                    className={cn("h-2 rounded-full", 
                      portfolioSummary.totalGain >= 0 ? "bg-green-500" : "bg-red-500"
                    )} 
                    style={{ width: `${Math.min(Math.abs(portfolioSummary.totalGainPercent), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Unrealized P/L</div>
                    <div className={cn("font-semibold", getColorByChange(portfolioSummary.totalGain))}>
                      {formatCurrency(portfolioSummary.totalGain)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-auto">
              <Button className="w-full mt-4" size="sm" variant="default">
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummaryCard;
