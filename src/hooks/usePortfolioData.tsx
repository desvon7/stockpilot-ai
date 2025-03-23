import React from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  dayChange: number;
  dayChangePercentage: number;
  totalReturn: number;
  returnPercentage: number;
  allocationPercentage: number;
}

export interface SectorAllocation {
  name: string;
  value: number;
  percentage: number;
}

export interface PortfolioData {
  totalValue: number;
  availableCash: number;
  dayChange: number;
  dayChangePercentage: number;
  totalReturn: number;
  totalReturnPercentage: number;
  holdings: PortfolioHolding[];
  sectorAllocations: SectorAllocation[];
}

const usePortfolioData = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = React.useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  // Extract sector data for easier use in components
  const sectors = React.useMemo(() => {
    return portfolio?.sectorAllocations || [];
  }, [portfolio]);

  // Mock sector classification for stocks
  const sectorMap: Record<string, string> = {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'GOOGL': 'Technology',
    'AMZN': 'Consumer Cyclical',
    'META': 'Technology',
    'NFLX': 'Communication Services',
    'TSLA': 'Consumer Cyclical',
    'JPM': 'Financial Services',
    'BAC': 'Financial Services',
    'WMT': 'Consumer Defensive',
    'NVDA': 'Technology',
    'DIS': 'Communication Services',
    'V': 'Financial Services',
    'JNJ': 'Healthcare',
    'PG': 'Consumer Defensive',
    'MA': 'Financial Services',
    'UNH': 'Healthcare',
    'HD': 'Consumer Cyclical',
    'INTC': 'Technology',
    'CMCSA': 'Communication Services',
    'XOM': 'Energy',
    'VZ': 'Communication Services',
    'ADBE': 'Technology',
    'CSCO': 'Technology',
    'PFE': 'Healthcare',
    'KO': 'Consumer Defensive',
    'NKE': 'Consumer Cyclical',
    'T': 'Communication Services',
    'MRK': 'Healthcare',
    'CRM': 'Technology'
  };

  // Function to create simulated current prices and day changes
  const simulateMarketData = (symbol: string, averagePrice: number): { currentPrice: number; dayChange: number } => {
    // Generate a current price within +/- 15% of average price
    const changeRange = averagePrice * 0.15;
    const currentPrice = averagePrice + (Math.random() * changeRange * 2 - changeRange);
    
    // Generate a day change between -3% and +3%
    const dayChangePercent = (Math.random() * 6 - 3) / 100;
    const dayChange = currentPrice * dayChangePercent;
    
    return {
      currentPrice: Number(currentPrice.toFixed(2)),
      dayChange: Number(dayChange.toFixed(2))
    };
  };

  React.useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user) {
        setPortfolio(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user's buying power (cash balance)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('buying_power')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        const availableCash = profileData?.buying_power || 0;
        
        // Fetch holdings from portfolio
        const { data: holdingsData, error: holdingsError } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id);
        
        if (holdingsError) throw holdingsError;
        
        let investedValue = 0;
        let dayChange = 0;
        const sectorValues: Record<string, number> = {};
        
        // Process holdings data
        const processedHoldings: PortfolioHolding[] = (holdingsData || []).map(holding => {
          // Get simulated market data
          const marketData = simulateMarketData(holding.symbol, holding.average_price);
          
          // Calculate returns
          const value = holding.shares * marketData.currentPrice;
          const costBasis = holding.shares * holding.average_price;
          const totalReturn = value - costBasis;
          const returnPercentage = (totalReturn / costBasis) * 100;
          
          // Track sector allocation
          const sector = sectorMap[holding.symbol] || 'Other';
          sectorValues[sector] = (sectorValues[sector] || 0) + value;
          
          // Track portfolio totals
          investedValue += value;
          dayChange += marketData.dayChange * holding.shares;
          
          return {
            id: holding.id,
            symbol: holding.symbol,
            name: holding.company_name,
            shares: holding.shares,
            averagePrice: holding.average_price,
            currentPrice: marketData.currentPrice,
            value,
            dayChange: marketData.dayChange * holding.shares,
            dayChangePercentage: (marketData.dayChange / marketData.currentPrice) * 100,
            totalReturn,
            returnPercentage,
            allocationPercentage: 0 // Will calculate after getting total
          };
        });
        
        // Calculate allocation percentages
        const totalValue = investedValue + availableCash;
        processedHoldings.forEach(holding => {
          holding.allocationPercentage = (holding.value / totalValue) * 100;
        });
        
        // Calculate sector allocations
        const sectorAllocations: SectorAllocation[] = Object.entries(sectorValues).map(([name, value]) => ({
          name,
          value,
          percentage: (value / totalValue) * 100
        }));
        
        // Sort sector allocations by value (descending)
        sectorAllocations.sort((a, b) => b.value - a.value);
        
        // Create final portfolio data object
        const portfolioData: PortfolioData = {
          totalValue,
          availableCash,
          dayChange,
          dayChangePercentage: totalValue ? (dayChange / totalValue) * 100 : 0,
          totalReturn: investedValue - (processedHoldings.reduce((sum, h) => sum + (h.shares * h.averagePrice), 0)),
          totalReturnPercentage: 0, // Calculated below
          holdings: processedHoldings,
          sectorAllocations
        };
        
        // Calculate total return percentage
        const totalCost = processedHoldings.reduce((sum, h) => sum + (h.shares * h.averagePrice), 0);
        portfolioData.totalReturnPercentage = totalCost ? (portfolioData.totalReturn / totalCost) * 100 : 0;
        
        setPortfolio(portfolioData);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch portfolio data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  return { portfolio, sectors, isLoading, error };
};

export default usePortfolioData;
