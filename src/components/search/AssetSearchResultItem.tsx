
import React from 'react';
import { ChevronRight, BarChart2, Bitcoin, TrendingUp } from 'lucide-react';
import { CommandItem } from "@/components/ui/command";
import { cn } from '@/lib/utils';
import { AssetSearchResult } from '@/types/search';

interface AssetSearchResultItemProps {
  result: AssetSearchResult;
  onSelect: (asset: AssetSearchResult) => void;
}

const AssetSearchResultItem: React.FC<AssetSearchResultItemProps> = ({ result, onSelect }) => {
  const getIcon = () => {
    switch (result.type) {
      case 'stock':
        return <BarChart2 className="mr-2 h-4 w-4" />;
      case 'crypto':
        return <Bitcoin className="mr-2 h-4 w-4" />;
      case 'etf':
        return <TrendingUp className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <CommandItem
      key={result.symbol}
      onSelect={() => onSelect(result)}
      className="flex items-center justify-between py-2"
    >
      <div className="flex items-center">
        {getIcon()}
        <span>{result.symbol}</span>
        <span className="ml-2 text-muted-foreground">{result.name}</span>
      </div>
      <div className="flex items-center">
        <span className="mr-2">${result.price?.toFixed(2)}</span>
        <span className={cn(
          "text-xs",
          result.change && result.change > 0 ? "text-success" : "text-destructive"
        )}>
          {result.change && result.change > 0 ? '+' : ''}{result.change?.toFixed(2)}%
        </span>
        <ChevronRight className="ml-2 h-4 w-4" />
      </div>
    </CommandItem>
  );
};

export default AssetSearchResultItem;
