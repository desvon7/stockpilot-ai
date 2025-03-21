
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StockSearchResult, searchStocks } from '@/services/stockService';

export function useStockSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: searchResults,
    isLoading: searchLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stockSearch', query],
    queryFn: () => searchStocks(query),
    enabled: query.length >= 2,
    staleTime: 60000, // 1 minute
  });

  // Handle clicks outside of the search component
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

  // Reset selected index when results change
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
      return searchResults[selectedIndex];
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
    return null;
  };

  const resetSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    searchResults,
    searchLoading,
    error,
    searchRef,
    inputRef,
    handleInputChange,
    handleKeyDown,
    resetSearch
  };
}
