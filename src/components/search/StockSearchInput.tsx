
import React, { useState, useCallback } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StockSearchResult } from '@/services/stockService';
import { useStockSearch } from '@/hooks/useStockSearch';

interface StockSearchInputProps {
  onSelectStock: (stock: StockSearchResult) => void;
  placeholder?: string;
  buttonText?: React.ReactNode;
  className?: string;
  darkMode?: boolean;
}

const StockSearchInput: React.FC<StockSearchInputProps> = ({ 
  onSelectStock,
  placeholder = 'Search for stocks...',
  buttonText = 'Add',
  className = '',
  darkMode = false
}) => {
  const {
    query,
    isOpen,
    setIsOpen,
    selectedIndex,
    searchResults,
    searchLoading,
    searchRef,
    inputRef,
    handleInputChange,
    handleKeyDown,
    resetSearch
  } = useStockSearch();

  const handleSelectStock = useCallback((stock: StockSearchResult) => {
    onSelectStock(stock);
    resetSearch();
  }, [onSelectStock, resetSearch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    const selectedStock = handleKeyDown(e);
    if (selectedStock) {
      handleSelectStock(selectedStock);
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2", 
            darkMode ? "text-gray-500" : "text-muted-foreground"
          )} 
          size={18} 
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className={cn(
            "w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2",
            darkMode 
              ? "bg-gray-900 border border-gray-800 text-white focus:ring-primary/50" 
              : "bg-muted focus:ring-primary"
          )}
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={resetSearch}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2",
              darkMode ? "text-gray-500" : "text-muted-foreground"
            )}
          >
            <X size={16} />
          </button>
        )}
        {searchLoading && (
          <Loader2 
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin",
              darkMode ? "text-gray-400" : "text-primary"
            )} 
            size={18} 
          />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchResults && searchResults.length > 0 && (
        <div className={cn(
          "absolute z-50 w-full mt-1 border rounded-md shadow-lg overflow-hidden",
          darkMode 
            ? "bg-gray-900 border-gray-800" 
            : "bg-background border-border"
        )}>
          <ul className="py-1 max-h-64 overflow-auto">
            {searchResults.map((stock, index) => (
              <li
                key={stock.symbol}
                className={cn(
                  "px-4 py-2 cursor-pointer flex justify-between items-center",
                  index === selectedIndex 
                    ? (darkMode ? "bg-gray-800" : "bg-muted") 
                    : "hover:bg-muted",
                  darkMode ? "hover:bg-gray-800" : "hover:bg-muted"
                )}
                onClick={() => handleSelectStock(stock)}
              >
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {stock.name}
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={(e) => {
                  e.stopPropagation();
                  handleSelectStock(stock);
                }}>
                  {buttonText}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.length >= 2 && (!searchResults || searchResults.length === 0) && !searchLoading && (
        <div className={cn(
          "absolute z-50 w-full mt-1 border rounded-md shadow-lg py-8 text-center",
          darkMode 
            ? "bg-gray-900 border-gray-800 text-gray-400" 
            : "bg-background border-border text-muted-foreground"
        )}>
          No stocks found matching "{query}"
        </div>
      )}
    </div>
  );
};

export default StockSearchInput;
