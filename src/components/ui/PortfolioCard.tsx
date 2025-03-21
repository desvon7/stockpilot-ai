
import React from 'react';
import { cn } from '@/lib/utils';
import { PortfolioItem } from '@/utils/mockData';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import StockChart from './StockChart';
import { generateChartData } from '@/utils/mockData';

interface PortfolioCardProps {
  item: PortfolioItem;
  className?: string;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, className }) => {
  const { symbol, name, shares, avgPrice, currentPrice } = item;
  
  const totalValue = shares * currentPrice;
  const totalCost = shares * avgPrice;
  const profitLoss = totalValue - totalCost;
  const profitLossPercent = (profitLoss / totalCost) * 100;
  const isPositive = profitLoss >= 0;
  
  // Generate mock chart data for the stock
  const chartData = generateChartData(30, 0.02, isPositive ? 0.002 : -0.002);
  
  return (
    <div className={cn('glass-card rounded-lg overflow-hidden', className)}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{symbol}</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(currentPrice)}</p>
            <p className={cn('text-sm', getColorByChange(profitLoss))}>
              {isPositive ? '↑' : '↓'} {formatPercent(Math.abs(profitLossPercent))}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Shares</p>
            <p className="font-medium">{shares}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Price</p>
            <p className="font-medium">{formatCurrency(avgPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">P/L</p>
            <p className={cn('font-medium', getColorByChange(profitLoss))}>
              {formatCurrency(profitLoss)}
            </p>
          </div>
        </div>
        
        <StockChart data={chartData} positiveChange={isPositive} minimal />
      </div>
    </div>
  );
};

export default PortfolioCard;
