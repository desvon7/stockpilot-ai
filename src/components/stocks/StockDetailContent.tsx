
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderHistory from '@/components/orders/OrderHistory';
import StockChartControls from '@/components/stocks/StockChartControls';
import StockOverviewTab from '@/components/stocks/StockOverviewTab';
import StockNewsTab from '@/components/stocks/StockNewsTab';
import StockPlaceholderTab from '@/components/stocks/StockPlaceholderTab';
import StockChart from '@/components/ui/StockChart';
import StockHeader from '@/components/stocks/StockHeader';
import { useStockDetail, MockStockData } from '@/hooks/useStockDetail';

interface StockDetailContentProps {
  symbol: string;
  timeframe: string;
  setTimeframe: (timeframe: any) => void;
  mockChartData: any[];
  stockData: any;
  mockStockData: MockStockData;
}

const StockDetailContent: React.FC<StockDetailContentProps> = ({
  symbol,
  timeframe,
  setTimeframe,
  mockChartData,
  stockData,
  mockStockData
}) => {
  return (
    <>
      <StockHeader 
        symbol={stockData?.symbol || mockStockData.symbol}
        name={stockData?.name || mockStockData.name}
        sector={stockData?.sector || mockStockData.sector}
        price={stockData?.price || mockStockData.price}
        change={stockData?.change || mockStockData.change}
        changePercent={parseFloat(stockData?.changePercent || mockStockData.changePercent.toString())}
      />
      
      <Card className="mb-6">
        <CardContent className="p-0">
          <StockChartControls 
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
          <div className="h-64 md:h-80">
            <StockChart 
              data={mockChartData} 
              timeframe={timeframe} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <StockOverviewTab stockData={stockData || mockStockData} />
        </TabsContent>
        
        <TabsContent value="financials" className="mt-6">
          <StockPlaceholderTab 
            title="Financial Overview"
            description="Key financial metrics and reports"
            message="Financial data will be loaded when this tab is selected"
          />
        </TabsContent>
        
        <TabsContent value="news" className="mt-6">
          <StockNewsTab 
            stockName={stockData?.name || mockStockData.name} 
            symbol={stockData?.symbol || mockStockData.symbol}
          />
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-6">
          <StockPlaceholderTab 
            title="Analyst Ratings"
            description="Wall Street analyst ratings and price targets"
            message="Analyst data will be loaded when this tab is selected"
          />
        </TabsContent>
      </Tabs>
      
      <OrderHistory />
    </>
  );
};

export default StockDetailContent;
