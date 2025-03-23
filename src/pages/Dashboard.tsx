
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Portfolio from '@/components/dashboard/Portfolio';
import StockOverview from '@/components/dashboard/StockOverview';
import Recommendations from '@/components/dashboard/Recommendations';
import { useAuth } from '@/contexts/AuthContext';
import AccountSidebar from '@/components/layout/AccountSidebar';
import usePortfolioData from '@/hooks/usePortfolioData';
import PortfolioSectors from '@/components/dashboard/PortfolioSectors';
import PortfolioPerformance from '@/components/dashboard/PortfolioPerformance';
import { mockStocks } from '@/utils/mockData';
import PortfolioSummary from '@/components/dashboard/PortfolioSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MarketOverview from '@/components/dashboard/MarketOverview';
import LiveWatchlist from '@/components/market/LiveWatchlist';
import NewsFeed from '@/components/news/NewsFeed';
import { mockPortfolioData, mockActivities, mockMarketIndices, getFormattedDateTime } from '@/utils/mockMarketData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { portfolio, sectors, isLoading } = usePortfolioData();
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']);
  
  // Fetch user's watchlist symbols from Supabase
  useEffect(() => {
    const fetchWatchlistSymbols = async () => {
      if (!user) return;
      
      try {
        // First, check if the user has a default watchlist
        const { data: watchlists, error: watchlistError } = await supabase
          .from('watchlists')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (watchlistError) throw watchlistError;
        
        // If no watchlist exists, create one
        let watchlistId;
        if (!watchlists || watchlists.length === 0) {
          const { data: newWatchlist, error: createError } = await supabase
            .from('watchlists')
            .insert({
              name: 'Default Watchlist',
              user_id: user.id
            })
            .select('id')
            .single();
          
          if (createError) throw createError;
          watchlistId = newWatchlist.id;
        } else {
          watchlistId = watchlists[0].id;
        }
        
        // Now fetch watchlist items
        const { data: items, error: itemsError } = await supabase
          .from('watchlist_items')
          .select('symbol')
          .eq('watchlist_id', watchlistId);
        
        if (itemsError) throw itemsError;
        
        if (items && items.length > 0) {
          setWatchlistSymbols(items.map(item => item.symbol));
        }
      } catch (error) {
        console.error('Error fetching watchlist symbols:', error);
      }
    };
    
    fetchWatchlistSymbols();
  }, [user]);
  
  // Handle adding a symbol to the watchlist
  const handleAddSymbol = async (symbol: string) => {
    // Check if symbol is already in the watchlist
    if (watchlistSymbols.includes(symbol)) {
      toast.info(`${symbol} is already in your watchlist`);
      return;
    }
    
    // Add to local state first for responsive UI
    setWatchlistSymbols(prev => [...prev, symbol]);
    
    // If user is logged in, save to database
    if (user) {
      try {
        // Get the user's default watchlist ID
        const { data: watchlists, error: watchlistError } = await supabase
          .from('watchlists')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (watchlistError) throw watchlistError;
        
        if (!watchlists || watchlists.length === 0) {
          throw new Error('No watchlist found');
        }
        
        const watchlistId = watchlists[0].id;
        
        // Add the symbol to the watchlist
        const { error } = await supabase
          .from('watchlist_items')
          .insert({
            watchlist_id: watchlistId,
            symbol,
            company_name: symbol // Ideally, fetch the company name from an API
          });
        
        if (error) throw error;
        
        toast.success(`Added ${symbol} to your watchlist`);
      } catch (error) {
        console.error('Error adding symbol to watchlist:', error);
        toast.error('Failed to save to your watchlist');
        
        // Remove from local state if save failed
        setWatchlistSymbols(prev => prev.filter(s => s !== symbol));
      }
    }
  };
  
  // Filter stocks based on selected symbol if needed
  const stocksToDisplay = selectedStock 
    ? mockStocks.filter(stock => stock.symbol === selectedStock)
    : mockStocks;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow flex mt-16">
        <AccountSidebar />
        <main className="flex-grow p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {/* Portfolio Summary */}
            <div className="mb-8">
              <PortfolioSummary 
                portfolioValue={mockPortfolioData.portfolioValue}
                dailyChange={mockPortfolioData.dailyChange}
                dailyChangePercent={mockPortfolioData.dailyChangePercent}
                totalGain={mockPortfolioData.totalGain}
                totalGainPercent={mockPortfolioData.totalGainPercent}
                buyingPower={mockPortfolioData.buyingPower}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Portfolio 
                  portfolio={portfolio} 
                  isLoading={isLoading} 
                />
                <PortfolioSectors 
                  sectors={sectors}
                  isLoading={isLoading}
                />
                <StockOverview stocks={stocksToDisplay} />
                <RecentActivity activities={mockActivities} />
                
                {/* Financial News Feed */}
                <NewsFeed 
                  symbols={watchlistSymbols}
                  title="Latest Financial News"
                  maxItems={6}
                />
              </div>
              
              <div className="space-y-6">
                {/* Live Market Data Watchlist */}
                <LiveWatchlist 
                  symbols={watchlistSymbols}
                  title="Live Watchlist"
                  onAddSymbol={handleAddSymbol}
                />
                
                <MarketOverview 
                  indices={mockMarketIndices}
                  lastUpdated={getFormattedDateTime()}
                />
                <Recommendations recommendations={[]} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
