import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getColorByChange } from '@/utils/formatters';
import { PortfolioItem } from '@/services/portfolioService';
import PortfolioCard from '@/components/ui/PortfolioCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '@/hooks/usePortfolio';

interface PortfolioProps {
  portfolio: any; // Using any temporarily for the fix
  isLoading: boolean;
  className?: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, isLoading, className }) => {
  
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="glass-card rounded-lg p-6 flex justify-center items-center" style={{ minHeight: '300px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading portfolio data...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="glass-card rounded-lg p-6 text-center" style={{ minHeight: '200px' }}>
          <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
          <p className="text-destructive">Error loading portfolio data.</p>
          <p className="text-sm mt-2">{(error as Error).message}</p>
        </div>
      </div>
    );
  }
  
  if (!portfolio || portfolio.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="glass-card rounded-lg p-6 text-center" style={{ minHeight: '200px' }}>
          <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
          <p className="text-muted-foreground">You don't have any stocks in your portfolio yet.</p>
          <Link to="/stocks" className="mt-4 inline-block text-primary hover:underline">
            Browse stocks to start investing
          </Link>
        </div>
      </div>
    );
  }
  
  // Add current price for calculation (this would come from API in production)
  const portfolioWithCurrentPrice = portfolio.map(item => ({
    ...item,
    current_price: item.current_price || item.average_price * (Math.random() * 0.4 + 0.8), // Mocking current price for demo
    total_value: item.shares * (item.current_price || item.average_price * (Math.random() * 0.4 + 0.8))
  }));
  
  // Calculate total portfolio value and performance
  const totalValue = portfolioWithCurrentPrice.reduce((sum, item) => sum + (item.total_value || 0), 0);
  const totalCost = portfolioWithCurrentPrice.reduce((sum, item) => sum + (item.shares * item.average_price), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;
  
  // Prepare data for the pie chart
  const pieData = portfolioWithCurrentPrice.map(item => ({
    name: item.symbol,
    value: item.total_value
  }));
  
  // Colors for the pie chart
  const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  return (
    <div className={cn('space-y-6', className)}>
      <div className="glass-card rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Portfolio</h2>
          <Link to="/transactions" className="text-primary hover:underline text-sm">
            View Transaction History
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              {portfolioWithCurrentPrice.map((item) => (
                <div 
                  key={item.symbol}
                  className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.symbol}</p>
                    <p className="text-sm text-muted-foreground">{item.shares} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.total_value || 0)}</p>
                    <p className={cn('text-sm', getColorByChange((item.current_price || 0) - item.average_price))}>
                      {(item.current_price || 0) > item.average_price ? '↑' : '↓'} {formatPercent(Math.abs((((item.current_price || 0) - item.average_price) / item.average_price) * 100))}
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
          {portfolioWithCurrentPrice.map((item) => (
            <PortfolioCard 
              key={item.symbol} 
              item={{
                symbol: item.symbol,
                name: item.company_name,
                shares: item.shares,
                avgPrice: item.average_price,
                currentPrice: item.current_price || item.average_price
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
