
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { usePortfolioSectors } from '@/hooks/usePortfolioSectors';
import { Loader2 } from 'lucide-react';

interface PortfolioSectorsProps {
  className?: string;
}

const PortfolioSectors: React.FC<PortfolioSectorsProps> = ({ className }) => {
  const { sectors, isLoading, error } = usePortfolioSectors();
  
  // Colors for the pie chart
  const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#0EA5E9', '#14B8A6', '#6D28D9'];
  
  if (isLoading) {
    return (
      <div className={cn('glass-card rounded-lg p-6 flex justify-center items-center', className)} style={{ minHeight: '300px' }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading sector data...</span>
      </div>
    );
  }
  
  if (error || !sectors || sectors.length === 0) {
    return (
      <div className={cn('glass-card rounded-lg p-6 text-center', className)} style={{ minHeight: '300px' }}>
        <h2 className="text-2xl font-semibold mb-4">Sector Allocation</h2>
        <p className="text-muted-foreground">
          {error ? 'Error loading sector data.' : 'No sector data available.'}
        </p>
        {error && <p className="text-sm mt-2">{(error as Error).message}</p>}
      </div>
    );
  }
  
  return (
    <div className={cn('glass-card rounded-lg p-6', className)}>
      <h2 className="text-2xl font-semibold mb-6">Sector Allocation</h2>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectors}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {sectors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Value']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-medium">Sector Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sectors.map((sector, index) => (
            <div key={sector.name} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-sm mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{sector.name}</span>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(sector.value)}</p>
                <p className="text-sm text-muted-foreground">{formatPercent(sector.percentage)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSectors;
