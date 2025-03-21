
import React from 'react';
import { Star } from 'lucide-react';

interface EmptyWatchlistStateProps {
  isWatchlistSelected: boolean;
}

const EmptyWatchlistState: React.FC<EmptyWatchlistStateProps> = ({ isWatchlistSelected }) => {
  if (!isWatchlistSelected) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p>Select a watchlist to view its contents</p>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
      <p>This watchlist is empty</p>
      <p className="text-sm">Use the search below to add stocks</p>
    </div>
  );
};

export default EmptyWatchlistState;
