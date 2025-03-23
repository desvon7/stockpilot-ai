
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockTradingCard from '@/components/stocks/StockTradingCard';
import OptionsOrderForm from '@/components/orders/OptionsOrderForm';
import { AIRecommendation } from '@/hooks/useStockDetail';
import AIRecommendationCard from '@/components/ai/AIRecommendationCard';
import StockStatsCard from '@/components/stocks/StockStatsCard';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quote } from '@/types/marketData';
import { toast } from 'sonner';

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
  realTimeQuote?: Quote;
  refreshData?: () => Promise<void>;
}

const StockDetailSidebar: React.FC<StockDetailSidebarProps> = ({
  symbol,
  companyName,
  recommendation,
  statsData,
  realTimeQuote,
  refreshData
}) => {
  // Use real-time price if available, otherwise use recommendation price
  const [currentPrice, setCurrentPrice] = useState(recommendation.currentPrice);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Update price when real-time quote changes
  useEffect(() => {
    if (realTimeQuote?.price) {
      setCurrentPrice(realTimeQuote.price);
    }
  }, [realTimeQuote]);

  const handleRefresh = async () => {
    if (!refreshData) return;
    
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success(`Refreshed data for ${symbol}`);
    } catch (error) {
      toast.error('Failed to refresh data');
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
            <Link to="/stocks">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="truncate">Back</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-1" />
              <span className="truncate">Dashboard</span>
            </Link>
          </Button>
        </div>
        
        {refreshData && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="truncate">Refresh</span>
          </Button>
        )}
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
            currentPrice={currentPrice} 
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
