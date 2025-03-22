
// Fix the AddToWatchlist component to match how it's used in WatchlistsContainer.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export interface AddToWatchlistProps {
  stockSymbol?: string;
  activeWatchlist?: any;
  activeWatchlistId?: string;
  isAddingStock?: boolean;
  setIsAddingStock?: React.Dispatch<React.SetStateAction<boolean>>;
  refetchWatchlists?: () => void;
}

const AddToWatchlist: React.FC<AddToWatchlistProps> = ({ 
  stockSymbol,
  activeWatchlist,
  activeWatchlistId,
  isAddingStock,
  setIsAddingStock,
  refetchWatchlists
}) => {
  const handleAddToWatchlist = () => {
    // Implementation would go here
    console.log(`Adding ${stockSymbol} to watchlist`);
  };

  // Use stockSymbol prop when it's passed directly (from StockDetail page)
  // OR render watchlist selection UI when in Watchlists context
  if (stockSymbol) {
    return (
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleAddToWatchlist}
      >
        <Heart className="h-4 w-4 mr-2" />
        Add to Watchlist
      </Button>
    );
  }

  // This part would handle the watchlist management UI
  // when used from WatchlistsContainer
  return (
    <div>
      {/* Implement watchlist management UI here */}
      {/* This would use the activeWatchlist, activeWatchlistId props */}
    </div>
  );
};

export default AddToWatchlist;
