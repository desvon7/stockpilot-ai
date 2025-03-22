
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AddToWatchlistProps {
  stockSymbol: string;
}

const AddToWatchlist: React.FC<AddToWatchlistProps> = ({ stockSymbol }) => {
  const { toast } = useToast();

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${stockSymbol} has been added to your watchlist`,
    });
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
