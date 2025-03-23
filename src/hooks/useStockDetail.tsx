import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStockDetails } from '@/services/stockService';
import { TimeRange } from '@/components/ui/StockChart';

export interface AIRecommendation {
  symbol: string;
  name: string;
  recommendation: string;
  confidence: number;
  priceTarget: number;
  currentPrice: number;
  reasoning: string;
  timestamp: string;
}

export interface MockStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  peRatio: number;
  dividend: number;
  dividendYield: number;
  eps: number;
  beta: number;
  yearHigh: number;
  yearLow: number;
  sector: string;
  industry: string;
}

export const useStockDetail = (symbol: string | undefined) => {
  const [timeframe, setTimeframe] = useState<TimeRange>('1M');
  
  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock-details', symbol],
    queryFn: () => fetchStockDetails(symbol || ''),
    enabled: !!symbol
  });
  
  const mockStockData: MockStockData = {
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

  const statsData = stockData ? {
    open: stockData.open || 0,
    previousClose: stockData.previousClose || 0,
    dayHigh: stockData.yearHigh || 0,
    dayLow: stockData.yearLow || 0,
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
  
  return {
    stockData,
    mockStockData,
    mockChartData,
    mockNews,
    mockRecommendation,
    statsData,
    isLoading,
    timeframe,
    setTimeframe
  };
};

export default useStockDetail;
