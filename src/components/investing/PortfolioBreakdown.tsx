
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface PortfolioItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface PortfolioBreakdownProps {
  portfolioData: PortfolioItem[];
  totalPortfolioValue: number;
}

const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({
  portfolioData,
  totalPortfolioValue
}) => {
  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col items-center">
          <h3 className="text-lg font-medium mb-4 self-start">Total portfolio value</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xl font-bold mt-2">${formatCurrency(totalPortfolioValue)}</div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col items-center">
          <h3 className="text-lg font-medium mb-4 self-start">Stocks & options</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={[{ name: 'Stocks', value: portfolioData[0].value, color: '#4ade80' }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
              >
                <Cell fill="#4ade80" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xl font-bold mt-2">${formatCurrency(portfolioData[0].value)}</div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col items-center">
          <h3 className="text-lg font-medium mb-4 self-start">Cryptocurrencies</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={[{ name: 'Crypto', value: portfolioData[1].value, color: '#f87171' }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
              >
                <Cell fill="#f87171" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xl font-bold mt-2">${formatCurrency(portfolioData[1].value)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioBreakdown;
