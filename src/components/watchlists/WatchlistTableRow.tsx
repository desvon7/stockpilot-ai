
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { formatDate, formatCurrency, formatPercent } from '@/utils/formatters';
import { WatchlistItem } from '@/services/portfolioService';
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

interface WatchlistTableRowProps {
  item: WatchlistItem;
  onRemove: (itemId: string, symbol: string) => Promise<void>;
  isRemoving: boolean;
  itemToRemove: {id: string, symbol: string} | null;
}

const WatchlistTableRow: React.FC<WatchlistTableRowProps> = ({ 
  item, 
  onRemove, 
  isRemoving, 
  itemToRemove 
}) => {
  return (
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
                onClick={() => onRemove(item.id, item.symbol)}
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
  );
};

export default WatchlistTableRow;
