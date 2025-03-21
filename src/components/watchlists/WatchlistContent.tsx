
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Trash2, Star, Loader2, ArrowUp, ArrowDown, ChevronUp, ChevronDown } from 'lucide-react';
import { formatDate, formatCurrency, formatPercent } from '@/utils/formatters';
import { removeFromWatchlist } from '@/services/portfolioService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WatchlistItem } from '@/services/portfolioService';

type SortField = 'symbol' | 'name' | 'price' | 'change' | 'added';
type SortDirection = 'asc' | 'desc';

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

  // Function to render sort icons
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <div className="ml-1 opacity-20"><ChevronUp className="h-4 w-4" /></div>;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  // Sort the watchlist items
  const sortedWatchlistItems = React.useMemo(() => {
    if (!activeWatchlist?.watchlist_items) return [];
    
    return [...activeWatchlist.watchlist_items].sort((a, b) => {
      // Default cases for null/undefined values
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
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
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
      const symbolA = a.symbol.toLowerCase();
      const symbolB = b.symbol.toLowerCase();
      return sortDirection === 'asc' 
        ? symbolA.localeCompare(symbolB) 
        : symbolB.localeCompare(symbolA);
    });
  }, [activeWatchlist, sortField, sortDirection]);

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
            ? `Created on ${formatDate(activeWatchlist.created_at)}` 
            : 'Select a watchlist from the left to view its contents'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!activeWatchlist ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Select a watchlist to view its contents</p>
          </div>
        ) : activeWatchlist.watchlist_items?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>This watchlist is empty</p>
            <p className="text-sm">Use the search below to add stocks</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-primary flex items-center transition-colors"
                  onClick={() => handleSort('symbol')}
                >
                  <span className="flex items-center">
                    Symbol
                    {renderSortIcon('symbol')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary flex items-center transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center">
                    Name
                    {renderSortIcon('name')}
                  </span>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <span className="flex items-center justify-end">
                    Price
                    {renderSortIcon('price')}
                  </span>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('change')}
                >
                  <span className="flex items-center justify-end">
                    Change
                    {renderSortIcon('change')}
                  </span>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('added')}
                >
                  <span className="flex items-center">
                    Added
                    {renderSortIcon('added')}
                  </span>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedWatchlistItems.map((item: WatchlistItem) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link to={`/stocks/${item.symbol}`} className="text-primary hover:underline">
                      {item.symbol}
                    </Link>
                  </TableCell>
                  <TableCell>{item.company_name}</TableCell>
                  <TableCell className="text-right">
                    {item.current_price 
                      ? formatCurrency(item.current_price)
                      : <span className="text-muted-foreground">--</span>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    {item.price_change_percent != null ? (
                      <span 
                        className={`flex items-center justify-end gap-1 ${
                          item.price_change_percent > 0 
                            ? 'text-green-600' 
                            : item.price_change_percent < 0 
                              ? 'text-red-600' 
                              : ''
                        }`}
                      >
                        {item.price_change_percent > 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : item.price_change_percent < 0 ? (
                          <ArrowDown className="h-3 w-3" />
                        ) : null}
                        {formatPercent(Math.abs(item.price_change_percent))}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Stock</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {item.symbol} from this watchlist?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveStock(item.id, item.symbol)}
                            disabled={isRemoving}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isRemoving && itemToRemove?.id === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistContent;
