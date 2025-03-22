
import React from 'react';
import StockTradingCard from '@/components/stocks/StockTradingCard';
import AIRecommendationCard from '@/components/ai/AIRecommendationCard';
import StockStatsCard from '@/components/stocks/StockStatsCard';
import { AIRecommendation } from '@/hooks/useStockDetail';

interface StockDetailSidebarProps {
  symbol: string;
  companyName: string;
  recommendation: AIRecommendation;
  statsData: {
    open: number;
    previousClose: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    avgVolume: number;
  };
}

const StockDetailSidebar: React.FC<StockDetailSidebarProps> = ({
  symbol,
  companyName,
  recommendation,
  statsData
}) => {
  return (
    <div>
      <StockTradingCard 
        symbol={symbol}
        companyName={companyName}
      />
      
      <AIRecommendationCard 
        recommendation={recommendation}
        className="my-6"
      />
      
      <StockStatsCard stats={statsData} />
    </div>
  );
};

export default StockDetailSidebar;
