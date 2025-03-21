
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StockSearchResult } from '@/services/stockService';

interface StockResultItemProps {
  result: StockSearchResult;
  isSelected: boolean;
  query: string;
  darkMode?: boolean;
  buttonText?: React.ReactNode;
  onSelect: (stock: StockSearchResult) => void;
  onMouseEnter: () => void;
}

const StockResultItem: React.FC<StockResultItemProps> = ({
  result,
  isSelected,
  query,
  darkMode = false,
  buttonText,
  onSelect,
  onMouseEnter
}) => {
  const highlightMatchedText = (text: string) => {
    if (!query || query.length < 2) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="font-bold text-primary">{part}</span> : part
    );
  };

  return (
    <li
      className={cn(
        'px-4 py-2 cursor-pointer flex justify-between items-center',
        isSelected 
          ? (darkMode ? 'bg-gray-800' : 'bg-accent') 
          : 'hover:bg-accent/50',
        darkMode ? 'hover:bg-gray-800' : ''
      )}
      onClick={() => onSelect(result)}
      onMouseEnter={onMouseEnter}
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
          onSelect(result);
        }}
      >
        {buttonText ? buttonText : <ArrowRight size={18} />}
      </Button>
    </li>
  );
};

export default StockResultItem;
