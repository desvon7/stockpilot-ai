
import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import StockChart from '@/components/ui/StockChart';

interface PortfolioSummaryProps {
  portfolioSummary: {
    value: number;
    change: number;
    changePercent: number;
    buyingPower: number;
  };
  chartData: Array<{ date: string; price: number }>;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  portfolioSummary, 
  chartData 
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-3xl font-bold">Investing</h1>
        <button className="bg-amber-300 hover:bg-amber-400 text-black px-4 py-1.5 rounded-full text-sm font-medium flex items-center">
          <span className="mr-1">🎁</span> Gold Month
        </button>
      </div>
      <div className="flex items-baseline mb-1">
        <h2 className="text-4xl font-bold mr-3">{formatCurrency(portfolioSummary.value)}</h2>
      </div>
      <div className={cn("flex items-center mb-8", portfolioSummary.change >= 0 ? "text-green-500" : "text-red-500")}>
        <span className="flex items-center">
          {portfolioSummary.change >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(portfolioSummary.change))} ({formatPercent(Math.abs(portfolioSummary.changePercent))})
        </span>
        <span className="ml-1 text-muted-foreground">Today</span>
      </div>
      
      {/* Chart */}
      <div className="mb-8 h-64">
        <StockChart data={chartData} positiveChange={portfolioSummary.change >= 0} minimal={false} />
        
        <div className="flex mt-4 border-b border-border pb-2">
          <button className="px-4 py-1 text-primary border-b-2 border-primary">1D</button>
          <button className="px-4 py-1 text-muted-foreground">1W</button>
          <button className="px-4 py-1 text-muted-foreground">1M</button>
          <button className="px-4 py-1 text-muted-foreground">3M</button>
          <button className="px-4 py-1 text-muted-foreground">YTD</button>
          <button className="px-4 py-1 text-muted-foreground">1Y</button>
          <button className="px-4 py-1 text-muted-foreground">ALL</button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
