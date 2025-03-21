
import { useQuery } from '@tanstack/react-query';
import { getPortfolioSectors } from '@/services/portfolioService';
import { toast } from 'sonner';

export interface SectorAllocation {
  name: string;
  value: number;
  percentage: number;
}

export const usePortfolioSectors = () => {
  const {
    data: sectors,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['portfolioSectors'],
    queryFn: getPortfolioSectors,
    staleTime: 60 * 60 * 1000, // 1 hour
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch sector allocation: ${error.message}`);
      }
    }
  });

  return {
    sectors,
    isLoading,
    error,
    refetch
  };
};

export default usePortfolioSectors;
