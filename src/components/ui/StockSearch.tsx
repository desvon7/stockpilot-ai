
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StockSearchResult } from '@/services/stockService';
import { useStockSearch } from '@/hooks/useStockSearch';
import SearchInput from '@/components/search/SearchInput';
import StockResultsList from '@/components/search/StockResultsList';

interface StockSearchProps {
  className?: string;
  darkMode?: boolean;
  onSelectStock?: (stock: StockSearchResult) => void;
  isLoading?: boolean;
  buttonText?: string;
  disabled?: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ 
  className, 
  darkMode = false,
  onSelectStock,
  isLoading: externalLoading,
  buttonText,
  disabled
}) => {
  const navigate = useNavigate();
  const {
    query,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    searchResults,
    searchLoading,
    searchRef,
    inputRef,
    handleInputChange,
    handleKeyDown,
    resetSearch
  } = useStockSearch();

  const isLoading = externalLoading || searchLoading;

  const handleSelectStock = useCallback((stock: StockSearchResult) => {
    if (onSelectStock) {
      onSelectStock(stock);
    } else {
      navigate(`/stocks/${stock.symbol}`);
    }
    resetSearch();
  }, [onSelectStock, navigate, resetSearch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    const selectedStock = handleKeyDown(e);
    if (selectedStock) {
      handleSelectStock(selectedStock);
    }
  };

  return (
    <div ref={searchRef} className={className}>
      <SearchInput
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleSearchKeyDown}
        isLoading={isLoading}
        darkMode={darkMode}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        disabled={disabled}
      />

      <StockResultsList
        isOpen={isOpen}
        query={query}
        searchResults={searchResults}
        selectedIndex={selectedIndex}
        darkMode={darkMode}
        buttonText={buttonText}
        isLoading={isLoading}
        onSelect={handleSelectStock}
        onSetSelectedIndex={setSelectedIndex}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default StockSearch;
