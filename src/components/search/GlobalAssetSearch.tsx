
import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStockSearch } from '@/hooks/useStockSearch';
import { useNavigate } from 'react-router-dom';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

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
  
  const {
    query,
    setQuery,
    searchResults,
    searchLoading,
    resetSearch
  } = useStockSearch();

  // Set up keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelectStock = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
    setOpen(false);
    resetSearch();
  };

  // Close and reset when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
      
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <Command className={darkMode ? "bg-gray-900" : "bg-white"}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search stocks, cryptocurrencies, ETFs..." 
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onValueChange={(value) => setQuery(value)}
            />
            {searchLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-70" />}
            {query && !searchLoading && (
              <Button 
                variant="ghost" 
                className="h-6 w-6 p-0 rounded-md" 
                onClick={() => resetSearch()}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CommandList>
            {query.length < 2 ? (
              <CommandEmpty className="py-6 text-center text-sm">
                Start typing to search for stocks
              </CommandEmpty>
            ) : searchLoading ? (
              <div className="py-6 text-center">
                <Loader2 className="h-6 w-6 mx-auto animate-spin opacity-50" />
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <CommandGroup heading="Stocks">
                {searchResults.map((result) => (
                  <CommandItem
                    key={result.symbol}
                    onSelect={() => handleSelectStock(result.symbol)}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="font-medium flex items-center">
                          {result.symbol}
                          {result.type === 'ETF' && (
                            <Badge className="ml-2 text-xs" variant="secondary">ETF</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{result.name}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty className="py-6 text-center">
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                <Button 
                  variant="ghost" 
                  className="mt-2" 
                  onClick={() => navigate('/stocks')}
                >
                  Browse all stocks
                </Button>
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAssetSearch;
