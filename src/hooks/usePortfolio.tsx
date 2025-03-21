
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserPortfolio, executeTransaction } from '@/services/portfolioService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const usePortfolio = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const {
    data: portfolio,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: getUserPortfolio,
    enabled: !!user,
    staleTime: 60000, // 1 minute
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch portfolio: ${error.message}`);
      }
    }
  });

  const buyStockMutation = useMutation({
    mutationFn: ({ symbol, companyName, shares, pricePerShare }: {
      symbol: string;
      companyName: string;
      shares: number;
      pricePerShare: number;
    }) => {
      return executeTransaction(
        symbol,
        companyName,
        'buy',
        shares,
        pricePerShare
      );
    },
    onSuccess: () => {
      toast.success('Stock purchased successfully!');
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to buy stock: ${error.message}`);
    }
  });

  const sellStockMutation = useMutation({
    mutationFn: ({ symbol, companyName, shares, pricePerShare }: {
      symbol: string;
      companyName: string;
      shares: number;
      pricePerShare: number;
    }) => {
      return executeTransaction(
        symbol,
        companyName,
        'sell',
        shares,
        pricePerShare
      );
    },
    onSuccess: () => {
      toast.success('Stock sold successfully!');
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to sell stock: ${error.message}`);
    }
  });

  return {
    portfolio,
    isLoading,
    error,
    refetch,
    buyStock: buyStockMutation.mutate,
    sellStock: sellStockMutation.mutate,
    isBuying: buyStockMutation.isPending,
    isSelling: sellStockMutation.isPending
  };
};

export default usePortfolio;
