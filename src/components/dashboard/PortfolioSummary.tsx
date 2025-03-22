
import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PortfolioSummaryProps {
  portfolioValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  totalGain: number;
  totalGainPercent: number;
  buyingPower: number;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  portfolioValue,
  dailyChange,
  dailyChangePercent,
  totalGain,
  totalGainPercent,
  buyingPower
}) => {
  const isPositiveDailyChange = dailyChange >= 0;
  const isPositiveTotalGain = totalGain >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
            Portfolio Value
          </CardTitle>
          <CardDescription>Your current holdings value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          
          <div className="flex items-center mt-2">
            <span className={`inline-flex items-center mr-4 ${isPositiveDailyChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveDailyChange ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              ${Math.abs(dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              ({Math.abs(dailyChangePercent).toFixed(2)}%)
            </span>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center mr-4 ${isPositiveTotalGain ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveTotalGain ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              ${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              ({Math.abs(totalGainPercent).toFixed(2)}%)
            </span>
            <span className="text-sm text-muted-foreground">All time</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-muted-foreground" />
            Buying Power
          </CardTitle>
          <CardDescription>Available funds for trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${buyingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Portfolio allocation</span>
              <span className="text-sm font-medium">
                {((portfolioValue / (portfolioValue + buyingPower)) * 100).toFixed(0)}% invested
              </span>
            </div>
            <Progress value={(portfolioValue / (portfolioValue + buyingPower)) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
