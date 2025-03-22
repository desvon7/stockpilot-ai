
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchStockDetails } from '@/services/stockService';
import StockChart, { TimeRange } from '@/components/ui/StockChart';
import AIRecommendationCard from '@/components/ai/AIRecommendationCard';

// Import refactored components
import StockHeader from '@/components/stocks/StockHeader';
import StockChartControls from '@/components/stocks/StockChartControls';
import StockOverviewTab from '@/components/stocks/StockOverviewTab';
import StockNewsTab from '@/components/stocks/StockNewsTab';
import StockTradingCard from '@/components/stocks/StockTradingCard';
import StockStatsCard from '@/components/stocks/StockStatsCard';
import StockPlaceholderTab from '@/components/stocks/StockPlaceholderTab';

interface AIRecommendation {
  symbol: string;
  name: string;
  recommendation: string;
  confidence: number;
  priceTarget: number;
  currentPrice: number;
  reasoning: string;
  timestamp: string;
}

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [timeframe, setTimeframe] = useState<TimeRange>('1M');
  
  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock-details', symbol],
    queryFn: () => fetchStockDetails(symbol || ''),
    enabled: !!symbol
  });
  
  const mockStockData = {
    symbol: symbol || 'AAPL',
    name: symbol === 'AAPL' ? 'Apple Inc.' : 
           symbol === 'MSFT' ? 'Microsoft Corporation' : 
           symbol === 'GOOGL' ? 'Alphabet Inc.' : 
           symbol === 'TSLA' ? 'Tesla, Inc.' : 
           symbol === 'NVDA' ? 'NVIDIA Corporation' : 'Stock Company',
    price: 187.68,
    change: 1.84,
    changePercent: 0.99,
    open: 186.12,
    previousClose: 185.84,
    dayHigh: 188.91,
    dayLow: 185.83,
    volume: 54876321,
    avgVolume: 58452136,
    marketCap: 2914736000000,
    peRatio: 32.11,
    dividend: 0.24,
    dividendYield: 0.51,
    eps: 5.84,
    beta: 1.28,
    yearHigh: 194.48,
    yearLow: 124.17,
    sector: 'Technology',
    industry: 'Consumer Electronics',
  };
  
  const mockChartData = Array.from({ length: 100 }, (_, i) => ({
    date: new Date(Date.now() - (100 - i) * 86400000).toISOString().split('T')[0],
    price: mockStockData.price - 10 + Math.random() * 20
  }));
  
  const mockNews = [
    {
      id: '1',
      title: `${mockStockData.name} Reports Strong Q3 Earnings`,
      summary: `${mockStockData.name} exceeded analyst expectations with impressive revenue growth and strong margins.`,
      source: 'Market Watch',
      date: '2023-06-09',
      url: '#',
    },
    {
      id: '2',
      title: `New Product Launch Boosts ${mockStockData.symbol} Outlook`,
      summary: 'Analysts raise price targets following successful product launch event.',
      source: 'Bloomberg',
      date: '2023-06-08',
      url: '#',
    },
    {
      id: '3',
      title: `${mockStockData.sector} Sector Showing Growth Despite Market Headwinds`,
      summary: `${mockStockData.name} and peers demonstrate resilience in challenging economic environment.`,
      source: 'Financial Times',
      date: '2023-06-07',
      url: '#',
    },
  ];
  
  const mockRecommendation: AIRecommendation = {
    symbol: mockStockData.symbol,
    name: mockStockData.name,
    recommendation: 'buy',
    confidence: 0.87,
    priceTarget: mockStockData.price * 1.15,
    currentPrice: mockStockData.price,
    reasoning: `${mockStockData.name} shows strong fundamentals with consistent revenue growth and expanding margins. The company's strategic investments in AI and new product lines position it well for future growth.`,
    timestamp: new Date().toISOString()
  };

  // Prepare the stats object for StockStatsCard
  const statsData = stockData ? {
    open: stockData.open || 0,
    previousClose: stockData.previousClose || 0,
    dayHigh: stockData.yearHigh || 0, // Use yearHigh as dayHigh if actual dayHigh is missing
    dayLow: stockData.yearLow || 0,   // Use yearLow as dayLow if actual dayLow is missing
    volume: stockData.volume || 0,
    avgVolume: stockData.avgVolume || 0
  } : {
    open: mockStockData.open,
    previousClose: mockStockData.previousClose,
    dayHigh: mockStockData.dayHigh,
    dayLow: mockStockData.dayLow,
    volume: mockStockData.volume,
    avgVolume: mockStockData.avgVolume
  };
  
  return (
    <>
      <Helmet>
        <title>{symbol ? `${symbol} Stock | StockPilot` : 'Stock Details | StockPilot'}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
          </div>
          
          <div>
            <StockTradingCard 
              symbol={stockData?.symbol || mockStockData.symbol} 
              companyName={stockData?.name || mockStockData.name}
            />
            
            <AIRecommendationCard 
              recommendation={mockRecommendation}
              className="mb-6"
            />
            
            <StockStatsCard stats={statsData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StockDetail;
