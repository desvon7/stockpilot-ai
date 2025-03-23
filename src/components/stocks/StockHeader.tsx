
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';

interface StockHeaderProps {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
}

const StockHeader: React.FC<StockHeaderProps> = ({
  symbol,
  name,
  sector,
  price,
  change,
  changePercent
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{symbol}</h1>
          <Badge variant="outline" className="text-xs">
            {sector}
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">{name}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold">{formatCurrency(price)}</div>
        <div className={`flex items-center justify-end ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change > 0 ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          <span>{formatCurrency(Math.abs(change))}</span>
          <span className="ml-1">({formatPercent(Math.abs(changePercent / 100))})</span>
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
