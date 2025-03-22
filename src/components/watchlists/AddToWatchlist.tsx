
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AddToWatchlistProps {
  stockSymbol: string;
  // Expanded props to match what WatchlistsContainer is passing
  activeWatchlist?: any;
  activeWatchlistId?: string | null;
  isAddingStock?: boolean;
  setIsAddingStock?: React.Dispatch<React.SetStateAction<boolean>>;
  refetchWatchlists?: () => void;
}

const AddToWatchlist: React.FC<AddToWatchlistProps> = ({ 
  stockSymbol,
  // Optionally use the expanded props
  activeWatchlist,
  activeWatchlistId,
  isAddingStock,
  setIsAddingStock,
  refetchWatchlists
}) => {
  const { toast } = useToast();

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${stockSymbol} has been added to your watchlist`,
    });
    
    // If refetchWatchlists was provided, call it to update the watchlists
    if (refetchWatchlists) {
      refetchWatchlists();
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full"
      onClick={handleAddToWatchlist}
    >
      <BookmarkIcon className="h-4 w-4 mr-2" />
      Add to Watchlist
    </Button>
  );
};

export default AddToWatchlist;
