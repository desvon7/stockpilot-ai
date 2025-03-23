
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Loader2 } from 'lucide-react';
import { StockSearchInput } from '@/components/search/StockSearchInput';
import { StockSearchResult } from '@/services/stockService';
import { addToWatchlist } from '@/services/portfolioService';
import { toast } from 'sonner';

export interface AddToWatchlistProps {
  stockSymbol?: string;
  activeWatchlist?: any;
  activeWatchlistId?: string | null;
  isAddingStock?: boolean;
  setIsAddingStock?: React.Dispatch<React.SetStateAction<boolean>>;
  refetchWatchlists?: () => void;
}

const AddToWatchlist: React.FC<AddToWatchlistProps> = ({ 
  stockSymbol,
  activeWatchlist,
  activeWatchlistId,
  isAddingStock = false,
  setIsAddingStock = () => {},
  refetchWatchlists = () => {}
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);

  // This handles single-stock direct add (e.g. from a stock detail page)
  const handleAddToWatchlist = async () => {
    if (!activeWatchlistId || !stockSymbol) {
      toast.error('Please select a watchlist first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addToWatchlist(
        activeWatchlistId, 
        stockSymbol, 
        selectedStock?.name || 'Unknown Company'
      );
      toast.success(`Added ${stockSymbol} to watchlist`);
      refetchWatchlists();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add stock to watchlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  // This handles the search & add flow (used in the Watchlists page)
  const handleAddStockToWatchlist = async (stock: StockSearchResult) => {
    if (!activeWatchlistId) {
      toast.error('Please select a watchlist first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addToWatchlist(
        activeWatchlistId, 
        stock.symbol, 
        stock.name
      );
      toast.success(`Added ${stock.symbol} to watchlist`);
      setSelectedStock(null);
      refetchWatchlists();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add stock to watchlist');
    } finally {
      setIsSubmitting(false);
      setIsAddingStock(false);
    }
  };

  // If we're on a stock detail page, show the simple "Add to Watchlist" button
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
          <Plus className="h-4 w-4 mr-2" />
        )}
        Add to Watchlist
      </Button>
    );
  }

  // On the Watchlists page, show the search interface
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <div>Add Stocks to Watchlist</div>
          {!isAddingStock && (
            <Button 
              size="sm"
              onClick={() => setIsAddingStock(true)}
              disabled={!activeWatchlistId}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      {isAddingStock && (
        <CardContent>
          {!activeWatchlistId ? (
            <div className="text-center py-4 text-muted-foreground">
              Please select a watchlist first
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <StockSearchInput 
                  onSelectStock={handleAddStockToWatchlist}
                  placeholder="Search for a stock to add to watchlist"
                  buttonText={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                />
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsAddingStock(false);
                    setSelectedStock(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AddToWatchlist;
