
import React from 'react';
import { Eye, Zap, Plus } from 'lucide-react';

interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  type?: string;
  date?: string;
}

interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

interface WatchlistsSectionProps {
  watchlists: Watchlist[];
}

const WatchlistsSection: React.FC<WatchlistsSectionProps> = ({ watchlists }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lists</h2>
        <button className="text-gray-400">
          <Plus size={20} />
        </button>
      </div>
      
      <div className="space-y-4">
        {watchlists.map((list) => (
          <div key={list.id} className="border border-border rounded-lg">
            <div className="flex justify-between items-center p-3 border-b border-border">
              <div className="flex items-center">
                {list.name === 'Options Watchlist' ? <Eye size={16} className="mr-2" /> : <Zap size={16} className="mr-2" />}
                <span>{list.name}</span>
              </div>
              <button>
                {list.items.length > 0 ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                ) : null}
              </button>
            </div>
            
            {list.items.slice(0, 1).map((item) => (
              <div key={item.symbol} className="flex justify-between items-center p-3 border-b border-border">
                <div>
                  <div className="font-medium">{item.symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.type ? `${item.date} • ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${item.price.toFixed(2)}</div>
                  <div className={item.change > 0 ? "text-green-500" : (item.change < 0 ? "text-red-500" : "text-gray-500")}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination indicator */}
            <div className="flex justify-center items-center p-2 text-sm text-muted-foreground">
              <button className="mx-1">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                </svg>
              </button>
              <span>1 of {list.items.length}</span>
              <button className="mx-1">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistsSection;
