
import { usePortfolio } from './usePortfolio';
import { usePortfolioSectors } from './usePortfolioSectors';

export interface PortfolioData {
  portfolio: any;
  sectors: any;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  buyStock: (params: {
    symbol: string;
    companyName: string;
    shares: number;
    pricePerShare: number;
  }) => void;
  sellStock: (params: {
    symbol: string;
    companyName: string;
    shares: number;
    pricePerShare: number;
  }) => void;
  isBuying: boolean;
  isSelling: boolean;
}

export const usePortfolioData = (): PortfolioData => {
  const {
    portfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio,
    buyStock,
    sellStock,
    isBuying,
    isSelling
  } = usePortfolio();

  const {
    sectors,
    isLoading: sectorsLoading,
    error: sectorsError,
    refetch: refetchSectors
  } = usePortfolioSectors();

  // Combine refetch functions
  const refetch = () => {
    refetchPortfolio();
    refetchSectors();
  };

  // Determine combined loading state
  const isLoading = portfolioLoading || sectorsLoading;

  // Determine combined error state (prioritize portfolio error)
  const error = portfolioError || sectorsError || null;

  return {
    portfolio,
    sectors,
    isLoading,
    error,
    refetch,
    buyStock,
    sellStock,
    isBuying,
    isSelling
  };
};

export default usePortfolioData;
