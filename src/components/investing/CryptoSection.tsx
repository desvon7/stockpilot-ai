
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CryptoItem {
  symbol: string;
  name: string;
  quantity: string;
  price: number;
  cost: number;
  totalReturn: number;
  equity: number;
}

interface CryptoSectionProps {
  cryptoData: CryptoItem[];
  percentage: number;
}

const CryptoSection: React.FC<CryptoSectionProps> = ({ cryptoData, percentage }) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Cryptocurrencies</h2>
          <span className="text-sm text-muted-foreground">{percentage}%</span>
        </div>
        
        <table className="w-full mb-4">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Symbol</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Average cost</th>
              <th className="pb-2">Total return</th>
              <th className="pb-2 text-right">Equity</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => (
              <tr key={crypto.symbol} className="border-b border-border">
                <td className="py-3">{crypto.name}</td>
                <td className="py-3">{crypto.symbol}</td>
                <td className="py-3">{crypto.quantity}</td>
                <td className="py-3">${crypto.price.toFixed(8)}</td>
                <td className="py-3">${crypto.cost.toFixed(2)}</td>
                <td className="py-3 text-red-500">▼ ${crypto.totalReturn.toFixed(2)}</td>
                <td className="py-3 text-right">${crypto.equity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default CryptoSection;
