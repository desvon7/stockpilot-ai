
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTradingCard from '@/components/stocks/StockTradingCard';
import OptionsOrderForm from '@/components/orders/OptionsOrderForm';
import { AIRecommendation } from '@/hooks/useStockDetail';
import AIRecommendationCard from '@/components/ai/AIRecommendationCard';
import StockStatsCard from '@/components/stocks/StockStatsCard';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [currentPrice, setCurrentPrice] = useState(recommendation.currentPrice);

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 mb-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/stocks">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Stocks
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/home">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="stock">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stock">Stocks</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>
        <TabsContent value="stock" className="mt-4">
          <StockTradingCard 
            symbol={symbol} 
            companyName={companyName} 
          />
        </TabsContent>
        <TabsContent value="options" className="mt-4">
          <OptionsOrderForm
            symbol={symbol}
            companyName={companyName}
            currentPrice={currentPrice}
          />
        </TabsContent>
      </Tabs>
      
      <StockStatsCard stats={statsData} />
      
      <AIRecommendationCard recommendation={recommendation} />
    </div>
  );
};

export default StockDetailSidebar;
