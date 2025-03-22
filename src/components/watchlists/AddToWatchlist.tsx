
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addToWatchlist } from '@/services/portfolioService';
import { StockSearchResult } from '@/services/stockService';
import StockSearch from '@/components/ui/StockSearch';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [symbol, setSymbol] = useState('');

  const handleAddToWatchlist = async () => {
    if (!stockSymbol || !activeWatchlistId) return;
    
    try {
      setIsSubmitting(true);
      await addToWatchlist(activeWatchlistId, stockSymbol, `${stockSymbol} Company`);
      toast.success(`Added ${stockSymbol} to watchlist`);
      if (refetchWatchlists) refetchWatchlists();
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
      toast.error('Failed to add stock to watchlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectStock = async (stock: StockSearchResult) => {
    if (!activeWatchlistId) {
      toast.error('Please select a watchlist first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addToWatchlist(activeWatchlistId, stock.symbol, stock.name || `${stock.symbol} Company`);
      toast.success(`Added ${stock.symbol} to watchlist`);
      if (refetchWatchlists) refetchWatchlists();
      if (setIsAddingStock) setIsAddingStock(false);
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
      toast.error('Failed to add stock to watchlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use stockSymbol prop when it's passed directly (from StockDetail page)
  if (stockSymbol) {
    return (
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleAddToWatchlist}
        disabled={isSubmitting || !activeWatchlistId}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Heart className="h-4 w-4 mr-2" />
        )}
        Add to Watchlist
      </Button>
    );
  }

  // This is the watchlist management UI (used in WatchlistsContainer)
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Add Stock to Watchlist</h3>
        {isAddingStock && setIsAddingStock && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAddingStock(false)}
          >
            Cancel
          </Button>
        )}
      </div>
      
      {!isAddingStock && setIsAddingStock ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAddingStock(true)}
          disabled={!activeWatchlistId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stock to {activeWatchlist?.name || 'Watchlist'}
        </Button>
      ) : (
        <StockSearch
          onSelectStock={handleSelectStock}
          isLoading={isSubmitting}
          buttonText="Add to Watchlist"
        />
      )}
    </div>
  );
};

export default AddToWatchlist;
