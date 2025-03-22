
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Loader2, 
  XCircle, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useStockSearch } from '@/hooks/useStockSearch';
import { cn } from '@/lib/utils';
import StockSearchInput from '@/components/search/StockSearchInput';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GlobalAssetSearchProps {
  darkMode?: boolean;
  trigger?: React.ReactNode;
}

const GlobalAssetSearch: React.FC<GlobalAssetSearchProps> = ({ 
  darkMode = false,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    query,
    searchResults,
    searchLoading,
    handleInputChange,
    selectedIndex,
    setSelectedIndex,
    resetSearch
  } = useStockSearch();

  const trendingStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' }
  ];

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      resetSearch();
    }
  }, [open, resetSearch]);

  const handleStockSelect = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
    setOpen(false);
    resetSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults || searchResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleStockSelect(searchResults[selectedIndex].symbol);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="relative w-full rounded-full pr-12 justify-start text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search assets...</span>
            <kbd className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[550px] p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <StockSearchInput
              ref={inputRef}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              isLoading={searchLoading}
              darkMode={darkMode}
              placeholder="Search stocks, ETFs, crypto, etc..."
              className="w-full"
            />
            {query && (
              <button
                onClick={resetSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XCircle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Assets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {trendingStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleStockSelect(stock.symbol)}
                  >
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchLoading ? (
            <div className="p-8 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.symbol}-${index}`}
                  className={cn(
                    "px-4 py-2 cursor-pointer flex justify-between items-center",
                    selectedIndex === index ? "bg-muted" : "hover:bg-muted/50"
                  )}
                  onClick={() => handleStockSelect(result.symbol)}
                >
                  <div>
                    <div className="font-medium">{result.symbol}</div>
                    <div className="text-sm text-muted-foreground">{result.name}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            query.length >= 2 && (
              <div className="p-8 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAssetSearch;
