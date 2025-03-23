
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StockSearchResult } from '@/services/stockService';
import { useStockSearch } from '@/hooks/useStockSearch';
import StockSearchInput from '@/components/search/StockSearchInput';
import StockSearchResults from '@/components/search/StockSearchResults';

interface StockSearchProps {
  className?: string;
  darkMode?: boolean;
  onSelectStock?: (stock: StockSearchResult) => void;
  isLoading?: boolean;
  buttonText?: string;
  disabled?: boolean;
  placeholder?: string;
  showAllAssetTypes?: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ 
  className, 
  darkMode = false,
  onSelectStock,
  isLoading: externalLoading,
  buttonText,
  disabled,
  placeholder = "Search for stocks, ETFs, crypto...",
  showAllAssetTypes = true
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

  // Filter results based on showAllAssetTypes setting
  const filteredResults = showAllAssetTypes
    ? searchResults
    : searchResults?.filter(result => result.type === 'Equity' || result.type === 'ETF');

  return (
    <div ref={searchRef} className={className}>
      <StockSearchInput
        ref={inputRef}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleSearchKeyDown}
        isLoading={isLoading}
        darkMode={darkMode}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        disabled={disabled}
        placeholder={placeholder}
      />

      <StockSearchResults
        isOpen={isOpen}
        query={query}
        results={filteredResults || []}
        selectedIndex={selectedIndex}
        darkMode={darkMode}
        buttonText={buttonText}
        isLoading={isLoading}
        onSelect={handleSelectStock}
        onSetSelectedIndex={setSelectedIndex}
        onClose={() => setIsOpen(false)}
        highlightQuery={query}
      />
    </div>
  );
};

export default StockSearch;
