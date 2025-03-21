
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '@/services/stockService';

export interface MarketDataItem {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

export interface MarketData {
  most_actively_traded: MarketDataItem[];
  top_gainers: MarketDataItem[];
  top_losers: MarketDataItem[];
  metadata?: {
    last_updated: string;
    markets: string[];
  };
}

export const useMarketData = (enabled = true) => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['marketData'],
    queryFn: () => fetchMarketData(),
    enabled: enabled,
    staleTime: 60000, // 1 minute
    refetchInterval: 5 * 60000, // Refetch every 5 minutes
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching market data:', error.message);
      }
    }
  });

  // Handle automatic refreshing
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (data) {
      setLastUpdated(new Date());
    }
  }, [data]);

  const refreshData = () => {
    refetch();
  };

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
};

export default useMarketData;
