
import React from 'react';

interface Stock {
  symbol: string;
  name: string;
  shares?: number;
  price: number;
  change: number;
  type?: string;
  date?: string;
}

interface StocksSectionProps {
  stocks: Stock[];
  limit?: number;
}

const StocksSection: React.FC<StocksSectionProps> = ({ stocks, limit = stocks.length }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Stocks</h2>
      <div className="space-y-3">
        {stocks.slice(0, limit).map((stock) => (
          <div key={stock.symbol} className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-muted-foreground">
                {stock.shares ? `${stock.shares} Shares` : (stock.type ? `${stock.date} • ${stock.type.charAt(0).toUpperCase() + stock.type.slice(1)}` : '')}
              </div>
            </div>
            <div className="flex">
              <div className="w-20 h-10">
                <svg viewBox="0 0 100 30" width="100%" height="100%">
                  <path d="M0,15 L10,10 L20,20 L30,5 L40,15 L50,10 L60,20 L70,15 L80,5 L90,15 L100,10" 
                        fill="none" 
                        stroke={stock.change >= 0 ? "green" : "red"} 
                        strokeWidth="2" />
                </svg>
              </div>
              <div className="text-right ml-4">
                <div className="font-medium">${stock.price.toFixed(2)}</div>
                <div className={stock.change > 0 ? "text-green-500" : (stock.change < 0 ? "text-red-500" : "text-gray-500")}>
                  {stock.change > 0 ? '+' : (stock.change < 0 ? '' : '')}{stock.change}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StocksSection;
