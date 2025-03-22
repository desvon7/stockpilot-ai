
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { StockSearchResult } from '@/services/stockService';

interface SearchResultsListProps {
  results: StockSearchResult[];
  selectedIndex: number;
  onSelect: (symbol: string) => void;
  highlightQuery?: string;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ 
  results, 
  selectedIndex, 
  onSelect,
  highlightQuery 
}) => {
  const highlightMatchedText = (text: string) => {
    if (!highlightQuery || highlightQuery.length < 2) return text;
    
    const regex = new RegExp(`(${highlightQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="font-bold text-primary">{part}</span> : part
    );
  };

  return (
    <div className="py-2">
      {results.map((result, index) => (
        <div
          key={`${result.symbol}-${index}`}
          className={cn(
            "px-4 py-2 cursor-pointer flex justify-between items-center",
            selectedIndex === index ? "bg-muted" : "hover:bg-muted/50"
          )}
          onClick={() => onSelect(result.symbol)}
        >
          <div>
            <div className="font-medium flex items-center gap-1">
              {highlightQuery ? highlightMatchedText(result.symbol) : result.symbol}
              {result.type === 'ETF' && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">ETF</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {highlightQuery ? highlightMatchedText(result.name) : result.name}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  );
};

export default SearchResultsList;
