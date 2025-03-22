
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface NewsCardSymbolsProps {
  symbols?: string[];
}

const NewsCardSymbols: React.FC<NewsCardSymbolsProps> = ({ symbols }) => {
  if (!symbols || symbols.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mt-3">
      {symbols.map(symbol => (
        <Badge key={symbol} variant="secondary" className="text-xs">
          {symbol}
        </Badge>
      ))}
    </div>
  );
};

export default NewsCardSymbols;
