
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  formatCurrency, 
  formatPercent, 
  getColorByChange, 
  getBgColorByChange, 
  getArrowByChange 
} from '@/utils/formatters';
import { StockData } from '@/utils/mockData';
import { ChevronRight, Search } from 'lucide-react';

interface StockOverviewProps {
  stocks: StockData[];
  className?: string;
}

const StockOverview: React.FC<StockOverviewProps> = ({ stocks, className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredStocks = searchQuery 
    ? stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stocks;
  
  return (
    <div className={cn('glass-card rounded-lg', className)}>
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Market Overview</h2>
          <Link 
            to="/stocks" 
            className="text-primary hover:underline flex items-center text-sm"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search stocks by name or symbol..."
            className="glass-input pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/40">
              <th className="text-left px-6 py-3 text-sm font-medium">Symbol</th>
              <th className="text-left px-6 py-3 text-sm font-medium">Name</th>
              <th className="text-right px-6 py-3 text-sm font-medium">Price</th>
              <th className="text-right px-6 py-3 text-sm font-medium">24h Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <tr 
                  key={stock.id} 
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/stocks/${stock.symbol}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {stock.symbol}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {stock.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    {formatCurrency(stock.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={cn(
                      'inline-flex items-center px-2 py-1 rounded-md text-sm',
                      getBgColorByChange(stock.change),
                      getColorByChange(stock.change)
                    )}>
                      {getArrowByChange(stock.change)} {formatPercent(Math.abs(stock.changePercent))}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No stocks found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOverview;
