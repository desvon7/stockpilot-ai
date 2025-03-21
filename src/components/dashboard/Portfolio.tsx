
import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import { PortfolioItem } from '@/utils/mockData';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PortfolioProps {
  portfolio: PortfolioItem[];
  className?: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, className }) => {
  // Calculate total portfolio value and performance
  const totalValue = portfolio.reduce((sum, item) => sum + (item.shares * item.currentPrice), 0);
  const totalCost = portfolio.reduce((sum, item) => sum + (item.shares * item.avgPrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;
  
  // Prepare data for the pie chart
  const pieData = portfolio.map(item => ({
    name: item.symbol,
    value: item.shares * item.currentPrice
  }));
  
  // Colors for the pie chart
  const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  return (
    <div className={cn('space-y-6', className)}>
      <div className="glass-card rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted/40 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalValue)}</p>
          </div>
          
          <div className="p-4 bg-muted/40 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Return</p>
            <p className={cn('text-2xl font-semibold', getColorByChange(totalGain))}>
              {formatCurrency(totalGain)} ({formatPercent(totalGainPercent)})
            </p>
          </div>
          
          <div className="p-4 bg-muted/40 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Positions</p>
            <p className="text-2xl font-semibold">{portfolio.length}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="font-medium text-lg mb-3">Holdings</h3>
            <div className="space-y-4">
              {portfolio.map((item, index) => (
                <div 
                  key={item.symbol}
                  className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.symbol}</p>
                    <p className="text-sm text-muted-foreground">{item.shares} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.shares * item.currentPrice)}</p>
                    <p className={cn('text-sm', getColorByChange(item.currentPrice - item.avgPrice))}>
                      {item.currentPrice > item.avgPrice ? '↑' : '↓'} {formatPercent(Math.abs(((item.currentPrice - item.avgPrice) / item.avgPrice) * 100))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-xl mb-4">Performance Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.map((item) => (
            <PortfolioCard key={item.symbol} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
