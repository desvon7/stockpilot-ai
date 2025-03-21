
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserWatchlists, getWatchlistStockPrices } from '@/services/portfolioService';
import { useAuth } from '@/contexts/AuthContext';
import WatchlistSidebar from './WatchlistSidebar';
import WatchlistContent from './WatchlistContent';
import AddToWatchlist from './AddToWatchlist';

const WatchlistsContainer: React.FC = () => {
  const { user } = useAuth();
  const [activeWatchlistId, setActiveWatchlistId] = useState<string | null>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [priceData, setPriceData] = useState<Record<string, any>>({});

  // Fetch watchlists
  const { 
    data: watchlists, 
    isLoading, 
    refetch,
    error 
  } = useQuery({
    queryKey: ['watchlists'], 
    queryFn: getUserWatchlists,
    enabled: !!user
  });

  const activeWatchlist = watchlists?.find(w => w.id === activeWatchlistId);

  // Get all unique symbols across watchlists
  const allSymbols = React.useMemo(() => {
    if (!watchlists) return [];
    
    const symbolsSet = new Set<string>();
    watchlists.forEach(watchlist => {
      watchlist.watchlist_items?.forEach(item => {
        symbolsSet.add(item.symbol);
      });
    });
    
    return Array.from(symbolsSet);
  }, [watchlists]);

  // Fetch price data for all watchlist items
  useEffect(() => {
    if (!allSymbols.length) return;

    const fetchPrices = async () => {
      try {
        const data = await getWatchlistStockPrices(allSymbols);
        setPriceData(data);
      } catch (error) {
        console.error('Error fetching stock prices:', error);
      }
    };

    fetchPrices();

    // Set up a polling interval for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(intervalId);
  }, [allSymbols]);

  // Enhance watchlists with price data
  const watchlistsWithPrices = React.useMemo(() => {
    if (!watchlists) return [];
    
    return watchlists.map(watchlist => ({
      ...watchlist,
      watchlist_items: watchlist.watchlist_items.map(item => ({
        ...item,
        current_price: priceData[item.symbol]?.price,
        price_change: priceData[item.symbol]?.change,
        price_change_percent: priceData[item.symbol]?.changePercent
      }))
    }));
  }, [watchlists, priceData]);

  const activeWatchlistWithPrices = watchlistsWithPrices?.find(w => w.id === activeWatchlistId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Watchlist Management */}
      <div className="md:col-span-1">
        <WatchlistSidebar
          watchlists={watchlistsWithPrices}
          isLoading={isLoading}
          error={error}
          activeWatchlistId={activeWatchlistId}
          setActiveWatchlistId={setActiveWatchlistId}
          refetchWatchlists={refetch}
        />
      </div>
      
      {/* Watchlist Content and Stock Search */}
      <div className="md:col-span-2">
        <WatchlistContent
          activeWatchlist={activeWatchlistWithPrices}
          refetchWatchlists={refetch}
        />
        
        <AddToWatchlist
          activeWatchlist={activeWatchlist}
          activeWatchlistId={activeWatchlistId}
          isAddingStock={isAddingStock}
          setIsAddingStock={setIsAddingStock}
          refetchWatchlists={refetch}
        />
      </div>
    </div>
  );
};

export default WatchlistsContainer;
