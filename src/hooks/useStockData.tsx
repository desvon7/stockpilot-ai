
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStockQuote, StockQuote } from '@/services/stockService';
import { toast } from 'sonner';

export const useStockData = (symbol: string, enabled = true) => {
  const {
    data: quoteData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: () => fetchStockQuote(symbol),
    enabled: !!symbol && enabled,
    staleTime: 60000, // 1 minute
    refetchInterval: 5 * 60000, // Refetch every 5 minutes
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch stock data: ${error.message}`);
      }
    }
  });

  // Handle automatic refreshing
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (quoteData) {
      setLastUpdated(new Date());
    }
  }, [quoteData]);

  const refreshData = () => {
    refetch();
    toast.success(`Refreshing ${symbol} data...`);
  };

  return {
    data: quoteData,
    isLoading,
    error,
    lastUpdated,
    refreshData
  };
};

export default useStockData;
