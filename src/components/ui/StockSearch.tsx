
import React, { useState, useRef, useEffect } from 'react';
import { searchStocks, StockSearchResult } from '@/services/stockService';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowRight, TrendingUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface StockSearchProps {
  className?: string;
  darkMode?: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ className, darkMode = false }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stockSearch', query],
    queryFn: () => searchStocks(query),
    enabled: query.length >= 2,
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchResults?.length) {
      setSelectedIndex(-1);
    }
  }, [searchResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelectStock = (stock: StockSearchResult) => {
    navigate(`/stocks/${stock.symbol}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard navigation in search results
    if (!searchResults || searchResults.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectStock(searchResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const highlightMatchedText = (text: string) => {
    if (!query || query.length < 2) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="font-bold text-primary">{part}</span> : part
    );
  };

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      <div className={cn('relative', darkMode ? 'text-white' : '')}>
        <Search 
          className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2', 
            darkMode ? 'text-gray-500' : 'text-muted-foreground'
          )} 
          size={18} 
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2',
            darkMode 
              ? 'bg-gray-900 border border-gray-800 text-white focus:ring-primary/50' 
              : 'bg-muted focus:ring-primary'
          )}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin',
              darkMode ? 'text-gray-400' : 'text-primary'
            )} 
            size={18} 
          />
        )}
      </div>

      {isOpen && searchResults && searchResults.length > 0 && (
        <div className={cn(
          'absolute w-full mt-2 rounded-md shadow-lg z-50 overflow-hidden',
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-card text-card-foreground'
        )}>
          <div className={cn(
            'py-1 px-3 text-xs font-semibold border-b',
            darkMode ? 'text-gray-400 border-gray-800' : 'text-muted-foreground border-border'
          )}>
            Stocks
          </div>
          <ul className="py-1 max-h-72 overflow-y-auto">
            {searchResults.map((result, index) => (
              <li
                key={result.symbol}
                className={cn(
                  'px-4 py-2 cursor-pointer flex justify-between items-center',
                  selectedIndex === index 
                    ? (darkMode ? 'bg-gray-800' : 'bg-accent') 
                    : 'hover:bg-accent/50',
                  darkMode ? 'hover:bg-gray-800' : ''
                )}
                onClick={() => handleSelectStock(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div>
                  <p className={cn(
                    'font-semibold flex items-center gap-1',
                    darkMode ? 'text-white' : ''
                  )}>
                    {highlightMatchedText(result.symbol)}
                    {result.type === 'ETF' && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                        ETF
                      </span>
                    )}
                  </p>
                  <p className={cn(
                    'text-sm truncate max-w-[240px]',
                    darkMode ? 'text-gray-400' : 'text-muted-foreground'
                  )}>
                    {highlightMatchedText(result.name)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    'ml-2',
                    darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : ''
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectStock(result);
                  }}
                >
                  <ArrowRight size={18} />
                </Button>
              </li>
            ))}
          </ul>
          <div className={cn(
            'p-2 border-t text-center',
            darkMode ? 'border-gray-800' : 'border-border'
          )}>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                'w-full text-xs',
                darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-muted-foreground'
              )}
              onClick={() => {
                navigate('/stocks');
                setIsOpen(false);
              }}
            >
              <TrendingUp size={14} className="mr-1" />
              View All Stocks
            </Button>
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && (!searchResults || searchResults.length === 0) && !isLoading && (
        <div className={cn(
          'absolute w-full mt-2 shadow-lg z-50 p-4 text-center rounded-md',
          darkMode 
            ? 'bg-gray-900 border border-gray-800 text-gray-400' 
            : 'bg-card text-muted-foreground'
        )}>
          <p>No results found for "{query}"</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              navigate('/stocks');
              setIsOpen(false);
            }}
          >
            Browse all stocks
          </Button>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
