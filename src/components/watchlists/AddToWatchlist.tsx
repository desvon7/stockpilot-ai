
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { addToWatchlist } from '@/services/portfolioService';
import StockSearch from '@/components/ui/StockSearch';
import { StockSearchResult } from '@/services/stockService';

interface AddToWatchlistProps {
  activeWatchlist: any | undefined;
  activeWatchlistId: string | null;
  isAddingStock: boolean;
  setIsAddingStock: React.Dispatch<React.SetStateAction<boolean>>;
  refetchWatchlists: () => void;
}

const AddToWatchlist: React.FC<AddToWatchlistProps> = ({ 
  activeWatchlist,
  activeWatchlistId,
  isAddingStock,
  setIsAddingStock,
  refetchWatchlists
}) => {
  const handleAddToWatchlist = async (stock: StockSearchResult) => {
    if (!activeWatchlistId) {
      toast.error('Please select a watchlist first');
      return;
    }

    try {
      setIsAddingStock(true);
      await addToWatchlist(activeWatchlistId, stock.symbol, stock.name);
      refetchWatchlists();
      toast.success(`Added ${stock.symbol} to watchlist`);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add stock to watchlist');
    } finally {
      setIsAddingStock(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add to Watchlist</CardTitle>
        <CardDescription>
          {activeWatchlist 
            ? `Search for stocks to add to "${activeWatchlist.name}"` 
            : 'Select a watchlist first'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!activeWatchlist ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Please select a watchlist from the left before adding stocks</p>
          </div>
        ) : (
          <StockSearch 
            onSelectStock={(stock) => {
              handleAddToWatchlist(stock);
            }}
            isLoading={isAddingStock}
            buttonText="Add to Watchlist"
            disabled={!activeWatchlistId}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AddToWatchlist;
