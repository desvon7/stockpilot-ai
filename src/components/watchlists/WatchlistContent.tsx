
import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { removeFromWatchlist } from '@/services/portfolioService';
import { toast } from 'sonner';
import { SortField, SortDirection } from './SortableTableHeader';
import EmptyWatchlistState from './EmptyWatchlistState';
import WatchlistTable from './WatchlistTable';
import { formatDate } from '@/utils/formatters';

interface WatchlistContentProps {
  activeWatchlist: any | undefined;
  refetchWatchlists: () => void;
}

const WatchlistContent: React.FC<WatchlistContentProps> = ({ 
  activeWatchlist,
  refetchWatchlists
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{id: string, symbol: string} | null>(null);
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleRemoveStock = async (itemId: string, symbol: string) => {
    try {
      setIsRemoving(true);
      setItemToRemove({ id: itemId, symbol });
      await removeFromWatchlist(itemId);
      refetchWatchlists();
      toast.success(`Removed ${symbol} from watchlist`);
      setItemToRemove(null);
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
      toast.error('Failed to remove stock from watchlist');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort the watchlist items
  const sortedWatchlistItems = useMemo(() => {
    if (!activeWatchlist?.watchlist_items?.length) return [];
    
    return [...activeWatchlist.watchlist_items].sort((a, b) => {
      // Handle null/undefined values
      if (sortField === 'price') {
        const priceA = a.current_price ?? 0;
        const priceB = b.current_price ?? 0;
        return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
      }
      
      if (sortField === 'change') {
        const changeA = a.price_change_percent ?? 0;
        const changeB = b.price_change_percent ?? 0;
        return sortDirection === 'asc' ? changeA - changeB : changeB - changeA;
      }
      
      if (sortField === 'added') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (sortField === 'name') {
        const nameA = a.company_name?.toLowerCase() ?? '';
        const nameB = b.company_name?.toLowerCase() ?? '';
        return sortDirection === 'asc' 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      }
      
      // Default: sort by symbol
      const symbolA = (a.symbol || '').toLowerCase();
      const symbolB = (b.symbol || '').toLowerCase();
      return sortDirection === 'asc' 
        ? symbolA.localeCompare(symbolB) 
        : symbolB.localeCompare(symbolA);
    });
  }, [activeWatchlist, sortField, sortDirection]);

  const watchlistCreationDate = activeWatchlist?.created_at 
    ? formatDate(activeWatchlist.created_at) 
    : 'Unknown date';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {activeWatchlist 
            ? `${activeWatchlist.name} (${activeWatchlist.watchlist_items?.length || 0})` 
            : 'Select a Watchlist'}
        </CardTitle>
        <CardDescription>
          {activeWatchlist 
            ? `Created on ${watchlistCreationDate}` 
            : 'Select a watchlist from the left to view its contents'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!activeWatchlist ? (
          <EmptyWatchlistState isWatchlistSelected={false} />
        ) : !activeWatchlist.watchlist_items?.length ? (
          <EmptyWatchlistState isWatchlistSelected={true} />
        ) : (
          <WatchlistTable 
            items={sortedWatchlistItems}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onRemoveStock={handleRemoveStock}
            isRemoving={isRemoving}
            itemToRemove={itemToRemove}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistContent;
