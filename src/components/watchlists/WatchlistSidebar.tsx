
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createWatchlist } from '@/services/portfolioService';
import { formatDate } from '@/utils/formatters';

interface WatchlistSidebarProps {
  watchlists: any[] | undefined;
  isLoading: boolean;
  error: Error | null;
  activeWatchlistId: string | null;
  setActiveWatchlistId: (id: string) => void;
  refetchWatchlists: () => void;
}

const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  watchlists,
  isLoading,
  error,
  activeWatchlistId,
  setActiveWatchlistId,
  refetchWatchlists
}) => {
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      toast.error('Please enter a watchlist name');
      return;
    }

    try {
      setIsCreating(true);
      await createWatchlist(newWatchlistName);
      setNewWatchlistName('');
      refetchWatchlists();
      toast.success(`Watchlist "${newWatchlistName}" created successfully`);
    } catch (error) {
      console.error('Error creating watchlist:', error);
      toast.error('Failed to create watchlist');
    } finally {
      setIsCreating(false);
    }
  };

  return (
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
  );
};

export default WatchlistSidebar;
