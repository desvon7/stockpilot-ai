
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '@/services/stockService';
import { toast } from 'sonner';

export interface MarketDataItem {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
  price_change: string;
}

export interface MarketData {
  top_gainers: MarketDataItem[];
  top_losers: MarketDataItem[];
  most_actively_traded: MarketDataItem[];
}

export const useMarketData = () => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    staleTime: 5 * 60000, // 5 minutes
    refetchInterval: 15 * 60000, // 15 minutes
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch market data: ${error.message}`);
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
    toast.success('Refreshing market data...');
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
