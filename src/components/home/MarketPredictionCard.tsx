
import React from 'react';
import { cn } from '@/lib/utils';
import StockChart from '@/components/ui/StockChart';
import { ChartData } from '@/types/chart';

interface MarketPredictionCardProps {
  data: ChartData[];
  isInView: boolean;
}

const MarketPredictionCard: React.FC<MarketPredictionCardProps> = ({ data, isInView }) => {
  // Convert ChartData to the format expected by StockChart
  const chartData = data.map(item => ({
    date: item.date,
    price: item.value
  }));

  return (
    <div className={cn(
      'glass-card rounded-lg p-6 transition-all duration-700 transform',
      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    )}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Market Prediction</h3>
        <p className="text-muted-foreground">AI-powered forecast with 89% confidence</p>
      </div>
      <StockChart data={chartData} />
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Our AI predicts a potential uptrend based on technical indicators, sentiment analysis, and market conditions.
        </p>
      </div>
    </div>
  );
};

export default MarketPredictionCard;
