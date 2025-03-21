
import { useQuery } from '@tanstack/react-query';
import { getPortfolioHistory } from '@/services/portfolioService';
import { toast } from 'sonner';

export interface PortfolioHistoryItem {
  date: string;
  totalValue: number;
  cashValue: number;
  stocksValue: number;
}

export const usePortfolioHistory = () => {
  const {
    data: history,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['portfolioHistory'],
    queryFn: getPortfolioHistory,
    staleTime: 60 * 60 * 1000, // 1 hour
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch portfolio history: ${error.message}`);
      }
    }
  });

  return {
    history,
    isLoading,
    error,
    refetch
  };
};

export default usePortfolioHistory;
