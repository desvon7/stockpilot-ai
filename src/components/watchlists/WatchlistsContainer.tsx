
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserWatchlists } from '@/services/portfolioService';
import { useAuth } from '@/contexts/AuthContext';
import WatchlistSidebar from './WatchlistSidebar';
import WatchlistContent from './WatchlistContent';
import AddToWatchlist from './AddToWatchlist';

const WatchlistsContainer: React.FC = () => {
  const { user } = useAuth();
  const [activeWatchlistId, setActiveWatchlistId] = useState<string | null>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Watchlist Management */}
      <div className="md:col-span-1">
        <WatchlistSidebar
          watchlists={watchlists}
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
          activeWatchlist={activeWatchlist}
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
