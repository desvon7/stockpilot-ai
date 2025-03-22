
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Table, TableBody, TableHead, TableHeader } from '@/components/ui/table';

interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  value: number;
  change: number;
  changePercent: number;
}

interface PortfolioPositionsProps {
  positions: Position[];
}

const PortfolioPositions: React.FC<PortfolioPositionsProps> = ({ positions }) => {
  return (
    <div className="portfolio-positions">
      <h2 className="text-2xl font-bold mb-4">Portfolio Positions</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.length > 0 ? (
            positions.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.symbol}</TableCell>
                <TableCell>{position.name}</TableCell>
                <TableCell className="text-right">{position.quantity}</TableCell>
                <TableCell className="text-right">${position.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${position.value.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${position.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {position.change >= 0 ? '+' : ''}
                  {position.change.toFixed(2)} ({position.changePercent.toFixed(2)}%)
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No positions in your portfolio yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PortfolioPositions;
