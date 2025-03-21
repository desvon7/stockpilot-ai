
import React from 'react';
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
import { Trash2, Star } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface WatchlistContentProps {
  activeWatchlist: any | undefined;
}

const WatchlistContent: React.FC<WatchlistContentProps> = ({ activeWatchlist }) => {
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
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeWatchlist.watchlist_items?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link to={`/stocks/${item.symbol}`} className="text-primary hover:underline">
                      {item.symbol}
                    </Link>
                  </TableCell>
                  <TableCell>{item.company_name}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
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
