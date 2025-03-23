
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderHistory from '@/components/orders/OrderHistory';
import StockChartControls from '@/components/stocks/StockChartControls';
import StockOverviewTab from '@/components/stocks/StockOverviewTab';
import StockNewsTab from '@/components/stocks/StockNewsTab';
import StockPlaceholderTab from '@/components/stocks/StockPlaceholderTab';
import StockChart, { TimeRange } from '@/components/ui/StockChart';
import StockHeader from '@/components/stocks/StockHeader';
import { useStockDetail, MockStockData } from '@/hooks/useStockDetail';
import FinancialsTab from '@/components/stocks/FinancialsTab';
import EarningsTab from '@/components/stocks/EarningsTab';
import CompanyInfoCard from '@/components/stocks/CompanyInfoCard';
import PolygonStockChart from '@/components/market/PolygonStockChart';

interface StockDetailContentProps {
  symbol: string;
  timeframe: TimeRange;
  setTimeframe: (timeframe: TimeRange) => void;
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
            <PolygonStockChart 
              symbol={symbol}
              title={`${symbol} Stock Chart`}
              description="Powered by Polygon.io"
            />
          </div>
        </CardContent>
      </Card>
      
      <CompanyInfoCard symbol={symbol} className="mb-6" />
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <StockOverviewTab stockData={stockData || mockStockData} />
        </TabsContent>
        
        <TabsContent value="financials" className="mt-6">
          <FinancialsTab symbol={symbol} />
        </TabsContent>
        
        <TabsContent value="earnings" className="mt-6">
          <EarningsTab symbol={symbol} />
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
