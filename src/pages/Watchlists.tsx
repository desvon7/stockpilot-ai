
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Trash2, Star, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getUserWatchlists, createWatchlist, addToWatchlist } from '@/services/portfolioService';
import { formatDate } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import StockSearch from '@/components/ui/StockSearch';

const Watchlists: React.FC = () => {
  const { user } = useAuth();
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeWatchlistId, setActiveWatchlistId] = useState<string | null>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Fetch watchlists
  const { 
    data: watchlists, 
    isLoading, 
    refetch,
    error 
  } = useQuery({
    queryKey: ['watchlists'], 
    queryFn: getUserWatchlists,
    enabled: !!user
  });

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      toast.error('Please enter a watchlist name');
      return;
    }

    try {
      setIsCreating(true);
      await createWatchlist(newWatchlistName);
      setNewWatchlistName('');
      refetch();
      toast.success(`Watchlist "${newWatchlistName}" created successfully`);
    } catch (error) {
      console.error('Error creating watchlist:', error);
      toast.error('Failed to create watchlist');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddToWatchlist = async (symbol: string, companyName: string) => {
    if (!activeWatchlistId) {
      toast.error('Please select a watchlist first');
      return;
    }

    try {
      setIsAddingStock(true);
      await addToWatchlist(activeWatchlistId, symbol, companyName);
      refetch();
      toast.success(`Added ${symbol} to watchlist`);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add stock to watchlist');
    } finally {
      setIsAddingStock(false);
    }
  };

  const activeWatchlist = watchlists?.find(w => w.id === activeWatchlistId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Watchlists</h1>
            <p className="text-muted-foreground">
              Create watchlists to track your favorite stocks and investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Watchlist Management */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Watchlists</CardTitle>
                  <CardDescription>Create and manage your watchlists</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-6">
                    <Input
                      placeholder="New Watchlist Name"
                      value={newWatchlistName}
                      onChange={(e) => setNewWatchlistName(e.target.value)}
                    />
                    <Button 
                      onClick={handleCreateWatchlist} 
                      disabled={isCreating || !newWatchlistName.trim()}
                    >
                      {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>Failed to load watchlists</p>
                    </div>
                  ) : watchlists?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You don't have any watchlists yet.</p>
                      <p>Create one to start tracking stocks!</p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {watchlists?.map((watchlist) => (
                        <li 
                          key={watchlist.id}
                          className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                            activeWatchlistId === watchlist.id 
                              ? 'bg-primary/10 border border-primary/30' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setActiveWatchlistId(watchlist.id)}
                        >
                          <div>
                            <div className="font-medium">{watchlist.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {watchlist.watchlist_items?.length || 0} stocks • Created {formatDate(watchlist.created_at)}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Watchlist Content and Stock Search */}
            <div className="md:col-span-2">
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
                        {activeWatchlist.watchlist_items?.map((item) => (
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
                        handleAddToWatchlist(stock.symbol, stock.name);
                      }}
                      isLoading={isAddingStock}
                      buttonText="Add to Watchlist"
                      disabled={!activeWatchlistId}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Watchlists;
