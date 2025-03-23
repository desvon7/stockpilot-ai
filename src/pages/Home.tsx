
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AccountLayout from '@/components/layout/AccountLayout';
import PortfolioSummary from '@/components/home/PortfolioSummary';
import BuyingPowerCard from '@/components/home/BuyingPowerCard';
import AnnouncementCard from '@/components/home/AnnouncementCard';
import CryptoCurrenciesSection from '@/components/home/CryptoCurrenciesSection';
import StocksSection from '@/components/home/StocksSection';
import WatchlistsSection from '@/components/home/WatchlistsSection';
import { usePortfolio } from '@/hooks/usePortfolio';
import { usePortfolioHistory } from '@/hooks/usePortfolioHistory';
import { useAuth } from '@/contexts/AuthContext';
import { getUserWatchlists, getWatchlistStockPrices } from '@/services/portfolioService';
import { toast } from 'sonner';

// Define a proper interface for watchlist items
interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  type?: string;
  date?: string;
}

interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const { portfolio, isLoading: isPortfolioLoading } = usePortfolio();
  const { history: portfolioHistory, isLoading: isHistoryLoading } = usePortfolioHistory();
  
  // Fetch real watchlists
  const { data: watchlistsData, isLoading: isWatchlistsLoading } = useQuery({
    queryKey: ['watchlists'],
    queryFn: getUserWatchlists,
    enabled: !!user
  });
  
  // Generate a portfolio summary from the real data
  const calculatePortfolioSummary = () => {
    if (isPortfolioLoading || !portfolio) {
      return {
        value: 0,
        change: 0,
        changePercent: 0,
        buyingPower: 0
      };
    }
    
    const totalValue = portfolio.reduce((sum, item) => {
      return sum + (item.shares * (item.current_price || item.average_price));
    }, 0);
    
    // Calculate daily change (mocked for now but could be improved with real daily data)
    const previousDayValue = totalValue * 0.97; // Assume ~3% change for demo
    const change = totalValue - previousDayValue;
    const changePercent = (change / previousDayValue) * 100;
    
    return {
      value: totalValue,
      change,
      changePercent,
      buyingPower: 4.75 // This would come from user profile in a real app
    };
  };
  
  const portfolioSummary = calculatePortfolioSummary();

  // Use real portfolio history data for the chart
  const chartData = portfolioHistory ? portfolioHistory.map(item => ({
    date: item.date,
    price: item.totalValue
  })) : [];
  
  // Process watchlists to the format needed by the component
  const watchlists: Watchlist[] = watchlistsData ? watchlistsData.map(watchlist => ({
    id: watchlist.id,
    name: watchlist.name,
    items: watchlist.watchlist_items.map(item => ({
      symbol: item.symbol,
      price: item.current_price || 0,
      change: item.price_change || 0,
      type: undefined,
      date: undefined
    }))
  })) : [];

  // Announcement data
  const announcement = {
    date: 'Mar 26',
    title: 'Robinhood announcement',
    content: 'You\'re invited to a livestream with CEO Vlad Tenev on March 26 at 6:30 PM PT/9:30 PM ET.'
  };

  return (
    <AccountLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portfolio Summary */}
        <PortfolioSummary 
          portfolioSummary={portfolioSummary} 
          chartData={chartData} 
        />
        
        {/* Buying Power */}
        <BuyingPowerCard buyingPower={portfolioSummary.buyingPower} />
        
        {/* Announcement - hidden by default now */}
        <AnnouncementCard announcement={announcement} showByDefault={false} />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Cryptocurrency Section - Use real portfolio data for cryptos */}
            <CryptoCurrenciesSection cryptos={
              portfolio?.filter(item => item.symbol === 'PEPE').map(item => ({
                symbol: item.symbol,
                name: 'Pepe',
                price: item.current_price || item.average_price,
                change: (item.profit_loss_percent || -4.55), // Fallback value
                holdings: item.shares
              })) || []
            } />
            
            {/* Stocks Section - Use real portfolio data for stocks */}
            <StocksSection stocks={
              portfolio?.filter(item => item.symbol !== 'PEPE').map(item => ({
                symbol: item.symbol, 
                name: item.company_name,
                shares: item.shares,
                price: item.current_price || item.average_price,
                change: item.profit_loss_percent || 0
              })) || []
            } limit={5} />
          </div>
          
          {/* Watchlists */}
          <div>
            <WatchlistsSection watchlists={watchlists} />
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Home;
