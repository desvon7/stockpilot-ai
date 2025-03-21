
import React, { useState } from 'react';
import { searchStocks, StockSearchResult } from '@/services/stockService';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';

interface StockSearchProps {
  className?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({ className }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary animate-spin" size={18} />
        )}
      </div>

      {isOpen && searchResults && searchResults.length > 0 && (
        <div className="absolute w-full mt-2 bg-card text-card-foreground rounded-md shadow-lg z-50">
          <ul className="py-2 max-h-72 overflow-y-auto">
            {searchResults.map((result) => (
              <li
                key={result.symbol}
                className="px-4 py-2 hover:bg-accent cursor-pointer"
                onClick={() => handleSelectStock(result)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{result.symbol}</p>
                    <p className="text-sm text-muted-foreground">{result.name}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.type} | {result.region}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.length >= 2 && (!searchResults || searchResults.length === 0) && !isLoading && (
        <div className="absolute w-full mt-2 bg-card text-card-foreground rounded-md shadow-lg z-50 p-4 text-center">
          <p className="text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
