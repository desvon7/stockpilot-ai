
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NewsFeed from '@/components/news/NewsFeed';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSidebar from '@/components/layout/AccountSidebar';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FinancialNews: React.FC = () => {
  const { user } = useAuth();
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
  const [topSymbols] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'BAC', 'WMT']);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('trending');
  
  // Fetch user's watchlist symbols
  useEffect(() => {
    fetchWatchlistSymbols();
  }, [user]);
  
  const fetchWatchlistSymbols = async () => {
    if (!user) {
      // If no user is logged in, switch to trending tab
      setActiveTab('trending');
      return;
    }
    
    try {
      console.log('Fetching watchlist symbols for user:', user.id);
      
      // First, check if the user has a default watchlist
      const { data: watchlists, error: watchlistError } = await supabase
        .from('watchlists')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (watchlistError) {
        console.error('Error fetching watchlists:', watchlistError);
        throw watchlistError;
      }
      
      if (!watchlists || watchlists.length === 0) {
        console.log('No watchlists found for user');
        return;
      }
      
      // Now fetch watchlist items
      const { data: items, error: itemsError } = await supabase
        .from('watchlist_items')
        .select('symbol')
        .eq('watchlist_id', watchlists[0].id);
      
      if (itemsError) {
        console.error('Error fetching watchlist items:', itemsError);
        throw itemsError;
      }
      
      if (items && items.length > 0) {
        const symbols = items.map(item => item.symbol);
        console.log('Found watchlist symbols:', symbols);
        setWatchlistSymbols(symbols);
      } else {
        console.log('No items in watchlist');
      }
    } catch (error) {
      console.error('Error fetching watchlist symbols:', error);
      toast.error('Failed to fetch your watchlist');
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Refetch watchlist if that tab is active
    if (activeTab === 'watchlist') {
      fetchWatchlistSymbols();
    }
    
    setTimeout(() => {
      setRefreshing(false);
      toast.success('News refreshed');
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Financial News | StockPilot</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex mt-16">
          <AccountSidebar />
          <main className="flex-grow p-6">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Financial News</h1>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          News is sourced from multiple data providers including Alpha Vantage, 
                          Finnhub, and NewsAPI. New articles are fetched every hour.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Stay up to date with the latest financial news affecting your investments and the broader market.
                  News articles are refreshed hourly and include market sentiment indicators where available.
                </p>
              </div>
              
              <Tabs 
                defaultValue={user ? 'watchlist' : 'trending'} 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value)}
                className="mb-6"
              >
                <TabsList>
                  <TabsTrigger value="watchlist" disabled={!user || watchlistSymbols.length === 0}>My Watchlist</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="all">All Markets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="watchlist" className="mt-6">
                  {watchlistSymbols.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You don't have any stocks in your watchlist yet.</p>
                      <p className="text-sm mt-2">Add stocks to your watchlist to see related news.</p>
                    </div>
                  ) : (
                    <NewsFeed 
                      symbols={watchlistSymbols}
                      title="News From Your Watchlist"
                      maxItems={12}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="trending" className="mt-6">
                  <NewsFeed 
                    symbols={topSymbols}
                    title="Trending Market News"
                    maxItems={12}
                  />
                </TabsContent>
                
                <TabsContent value="all" className="mt-6">
                  <NewsFeed 
                    symbols={[]}
                    title="All Market News"
                    maxItems={24}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FinancialNews;
