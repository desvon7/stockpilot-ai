
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
  description?: string;
}

// Add accurate stock data for common symbols
const getAccurateStockData = (symbol: string): Partial<MockStockData> => {
  const stockData: Record<string, Partial<MockStockData>> = {
    'AAPL': {
      name: 'Apple Inc.',
      price: 187.68,
      change: 1.84,
      changePercent: 0.99,
      marketCap: 2914736000000,
      peRatio: 31.06,
      eps: 6.31,
      dividendYield: 0.55,
      beta: 1.178,
      yearHigh: 259.81,
      yearLow: 163.31,
      sector: 'Technology',
      industry: 'Consumer Electronics',
      volume: 54876321,
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      price: 416.75,
      change: 2.33,
      changePercent: 0.56,
      marketCap: 3097200000000,
      peRatio: 36.2,
      eps: 11.32,
      dividendYield: 0.68,
      beta: 0.942,
      yearHigh: 429.36,
      yearLow: 302.21,
      sector: 'Technology',
      industry: 'Software—Infrastructure',
      volume: 21345678,
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      price: 162.35,
      change: -0.87,
      changePercent: -0.53,
      marketCap: 2013000000000,
      peRatio: 26.21,
      eps: 6.19,
      dividendYield: 0.48,
      beta: 1.042,
      yearHigh: 171.68,
      yearLow: 115.35,
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      volume: 18765432,
    },
    'TSLA': {
      name: 'Tesla, Inc.',
      price: 238.45,
      change: 5.76,
      changePercent: 2.48,
      marketCap: 753200000000,
      peRatio: 62.15,
      eps: 3.84,
      dividendYield: 0.0,
      beta: 2.31,
      yearHigh: 278.98,
      yearLow: 152.37,
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers',
      volume: 87654321,
    },
    'NVDA': {
      name: 'NVIDIA Corporation',
      price: 924.43,
      change: 15.68,
      changePercent: 1.73,
      marketCap: 2285000000000,
      peRatio: 68.44,
      eps: 13.51,
      dividendYield: 0.02,
      beta: 1.75,
      yearHigh: 974.99,
      yearLow: 228.43,
      sector: 'Technology',
      industry: 'Semiconductors',
      volume: 45678923,
    },
  };

  return stockData[symbol] || {};
};

export const useStockDetail = (symbol: string | undefined) => {
  const [timeframe, setTimeframe] = useState<TimeRange>('1M');
  
  const { 
    data: stockData, 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['stock-details', symbol],
    queryFn: () => fetchStockDetails(symbol || ''),
    enabled: !!symbol,
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error(`Error fetching stock details for ${symbol}:`, error);
      }
    }
  });
  
  // Get accurate mock data based on symbol
  const accurateData = symbol ? getAccurateStockData(symbol) : {};
  
  // Base mock data with fallbacks
  const baseMockStockData: MockStockData = {
    symbol: symbol || 'AAPL',
    name: 'Stock Company',
    price: 100.00,
    change: 0.00,
    changePercent: 0.00,
    open: 100.00,
    previousClose: 100.00,
    dayHigh: 100.00,
    dayLow: 100.00,
    volume: 0,
    avgVolume: 0,
    marketCap: 0,
    peRatio: 0,
    dividend: 0,
    dividendYield: 0,
    eps: 0,
    beta: 1.0,
    yearHigh: 100.00,
    yearLow: 100.00,
    sector: 'Unknown',
    industry: 'Unknown',
  };
  
  // Combine base data with accurate data
  const mockStockData = {
    ...baseMockStockData,
    ...accurateData
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
    recommendation: mockStockData.change >= 0 ? 'buy' : 'hold',
    confidence: mockStockData.change >= 0 ? 0.87 : 0.65,
    priceTarget: mockStockData.price * 1.15,
    currentPrice: mockStockData.price,
    reasoning: `${mockStockData.name} shows ${mockStockData.change >= 0 ? 'strong' : 'mixed'} fundamentals with ${mockStockData.change >= 0 ? 'consistent' : 'fluctuating'} revenue growth and ${mockStockData.change >= 0 ? 'expanding' : 'stable'} margins. The company's strategic investments in ${mockStockData.sector === 'Technology' ? 'AI and cloud services' : 'key growth areas'} position it ${mockStockData.change >= 0 ? 'well' : 'reasonably'} for future growth.`,
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
    error,
    timeframe,
    setTimeframe
  };
};

export default useStockDetail;
