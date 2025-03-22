
import { useStockData } from '@/hooks/useStockData';
import usePortfolio from '@/hooks/usePortfolio';

interface UseStockTradingProps {
  symbol: string;
}

export const useStockTrading = ({ symbol }: UseStockTradingProps) => {
  const { data: stockData, isLoading: isLoadingStock, refreshData } = useStockData(symbol);
  const { portfolio, refetch: refetchPortfolio } = usePortfolio();
  
  // Find if user already owns shares of this stock
  const ownedStock = portfolio?.find(item => item.symbol === symbol);
  const currentPrice = stockData?.price || 0;

  const handleOrderSuccess = () => {
    // Refresh both the portfolio and stock data
    refetchPortfolio();
    refreshData();
  };

  return {
    stockData,
    isLoadingStock,
    ownedStock,
    currentPrice,
    handleOrderSuccess
  };
};

export default useStockTrading;
