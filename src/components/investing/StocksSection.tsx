
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StockItem {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  cost: number;
  totalReturn: number;
  equity: number;
}

interface StocksSectionProps {
  stockData: StockItem[];
  percentage: number;
}

const StocksSection: React.FC<StocksSectionProps> = ({ stockData, percentage }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Stocks</h2>
          <span className="text-sm text-muted-foreground">{percentage}%</span>
        </div>
        
        <table className="w-full mb-4">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Symbol</th>
              <th className="pb-2">Shares</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Average cost</th>
              <th className="pb-2">Total return</th>
              <th className="pb-2 text-right">Equity</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock) => (
              <tr key={stock.symbol} className="border-b border-border">
                <td className="py-3">{stock.name}</td>
                <td className="py-3">{stock.symbol}</td>
                <td className="py-3">{stock.shares}</td>
                <td className="py-3">${stock.price.toFixed(2)}</td>
                <td className="py-3">${stock.cost.toFixed(2)}</td>
                <td className="py-3 text-green-500">▲ ${stock.totalReturn.toFixed(2)}</td>
                <td className="py-3 text-right">${stock.equity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default StocksSection;
