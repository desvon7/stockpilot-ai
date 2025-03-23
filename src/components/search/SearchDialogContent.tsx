
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  XCircle, 
  TrendingUp,
  ChevronRight,
  Home
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import StockSearchInput from '@/components/search/StockSearchInput';
import { useStockSearch } from '@/hooks/useStockSearch';
import TrendingAssetsSection from '@/components/search/TrendingAssetsSection';
import SearchResultsList from '@/components/search/SearchResultsList';

interface SearchDialogContentProps {
  darkMode?: boolean;
  onClose: () => void;
}

const SearchDialogContent: React.FC<SearchDialogContentProps> = ({ 
  darkMode = false,
  onClose
}) => {
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

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleStockSelect = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
    onClose();
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
      onClose();
    }
  };
  
  const navigateHome = () => {
    navigate('/home');
    onClose();
  };

  return (
    <>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative flex-1">
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
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 flex-shrink-0"
          onClick={navigateHome}
          title="Go to Home"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {query.length < 2 ? (
          <TrendingAssetsSection onSelectStock={handleStockSelect} />
        ) : searchLoading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : searchResults && searchResults.length > 0 ? (
          <SearchResultsList 
            results={searchResults} 
            selectedIndex={selectedIndex} 
            onSelect={handleStockSelect} 
          />
        ) : (
          query.length >= 2 && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="mb-2">No results found for "{query}"</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/stocks')}
                className="mt-2"
              >
                Browse All Assets
              </Button>
            </div>
          )
        )}
      </div>
      
      <div className="p-2 border-t flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={navigateHome}
          >
            <Home className="h-4 w-4 mr-1" />
            Home
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              navigate('/stocks');
              onClose();
            }}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            All Stocks
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default SearchDialogContent;
