
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList
} from "@/components/ui/command";
import { Search, ArrowRight, TrendingUp, ChevronRight, BarChart2, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AssetSearchResult {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf';
  price?: number;
  change?: number;
}

interface GlobalAssetSearchProps {
  darkMode?: boolean;
  trigger?: React.ReactNode;
}

const GlobalAssetSearch: React.FC<GlobalAssetSearchProps> = ({ 
  darkMode = false,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AssetSearchResult[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Mock search results - this would be replaced with a real API call
    const mockSearch = setTimeout(() => {
      const mockResults: AssetSearchResult[] = [
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', price: 175.34, change: 1.2 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', price: 326.78, change: -0.8 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', price: 135.12, change: 0.5 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', price: 130.22, change: -0.3 },
        { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'stock', price: 250.15, change: 2.1 },
        { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: 68432.10, change: 3.2 },
        { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: 3245.67, change: 1.5 },
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'etf', price: 420.69, change: 0.1 },
      ].filter(item => 
        item.symbol.toLowerCase().includes(query.toLowerCase()) || 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(mockSearch);
  }, [query]);

  const handleSelectAsset = (asset: AssetSearchResult) => {
    setOpen(false);
    
    if (asset.type === 'stock' || asset.type === 'etf') {
      navigate(`/stocks/${asset.symbol}`);
    } else if (asset.type === 'crypto') {
      navigate(`/crypto/${asset.symbol}`);
    }
  };

  const renderTrigger = () => {
    if (trigger) return React.cloneElement(trigger as React.ReactElement, {
      onClick: () => setOpen(true)
    });
    
    return (
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search assets...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    );
  };

  return (
    <div ref={searchRef}>
      {renderTrigger()}
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for stocks, crypto, ETFs..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
                <span className="ml-2">Searching...</span>
              </div>
            ) : (
              <p>No results found.</p>
            )}
          </CommandEmpty>
          
          {results.length > 0 && (
            <>
              <CommandGroup heading="Stocks">
                {results.filter(r => r.type === 'stock').map((result) => (
                  <CommandItem
                    key={result.symbol}
                    onSelect={() => handleSelectAsset(result)}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      <span>{result.symbol}</span>
                      <span className="ml-2 text-muted-foreground">{result.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">${result.price?.toFixed(2)}</span>
                      <span className={cn(
                        "text-xs",
                        result.change && result.change > 0 ? "text-success" : "text-destructive"
                      )}>
                        {result.change && result.change > 0 ? '+' : ''}{result.change?.toFixed(2)}%
                      </span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandGroup heading="Crypto">
                {results.filter(r => r.type === 'crypto').map((result) => (
                  <CommandItem
                    key={result.symbol}
                    onSelect={() => handleSelectAsset(result)}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <Bitcoin className="mr-2 h-4 w-4" />
                      <span>{result.symbol}</span>
                      <span className="ml-2 text-muted-foreground">{result.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">${result.price?.toFixed(2)}</span>
                      <span className={cn(
                        "text-xs",
                        result.change && result.change > 0 ? "text-success" : "text-destructive"
                      )}>
                        {result.change && result.change > 0 ? '+' : ''}{result.change?.toFixed(2)}%
                      </span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandGroup heading="ETFs">
                {results.filter(r => r.type === 'etf').map((result) => (
                  <CommandItem
                    key={result.symbol}
                    onSelect={() => handleSelectAsset(result)}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span>{result.symbol}</span>
                      <span className="ml-2 text-muted-foreground">{result.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">${result.price?.toFixed(2)}</span>
                      <span className={cn(
                        "text-xs",
                        result.change && result.change > 0 ? "text-success" : "text-destructive"
                      )}>
                        {result.change && result.change > 0 ? '+' : ''}{result.change?.toFixed(2)}%
                      </span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default GlobalAssetSearch;
