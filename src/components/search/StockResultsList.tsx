
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StockSearchResult } from '@/services/stockService';
import StockResultItem from './StockResultItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StockResultsListProps {
  isOpen: boolean;
  query: string;
  searchResults: StockSearchResult[] | undefined;
  selectedIndex: number;
  darkMode?: boolean;
  buttonText?: React.ReactNode;
  isLoading: boolean;
  onSelect: (stock: StockSearchResult) => void;
  onSetSelectedIndex: (index: number) => void;
  onClose: () => void;
}

const StockResultsList: React.FC<StockResultsListProps> = ({
  isOpen,
  query,
  searchResults,
  selectedIndex,
  darkMode = false,
  buttonText,
  isLoading,
  onSelect,
  onSetSelectedIndex,
  onClose
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Loading or empty state handling
  if (query.length >= 2 && (!searchResults || searchResults.length === 0) && !isLoading) {
    return (
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
            onClose();
          }}
        >
          Browse all stocks
        </Button>
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) return null;

  return (
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
      <ScrollArea className="max-h-72">
        <ul className="py-1">
          {searchResults.map((result, index) => (
            <StockResultItem
              key={result.symbol}
              result={result}
              isSelected={selectedIndex === index}
              query={query}
              darkMode={darkMode}
              buttonText={buttonText}
              onSelect={onSelect}
              onMouseEnter={() => onSetSelectedIndex(index)}
            />
          ))}
        </ul>
      </ScrollArea>
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
            onClose();
          }}
        >
          <TrendingUp size={14} className="mr-1" />
          View All Stocks
        </Button>
      </div>
    </div>
  );
};

export default StockResultsList;
