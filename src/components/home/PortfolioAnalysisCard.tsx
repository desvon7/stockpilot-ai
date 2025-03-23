import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SectorAllocation {
  name: string;
  percentage: number;
  color: string;
  value: number;
}

interface PortfolioAnalysisCardProps {
  isInView?: boolean;
  className?: string;
  totalValue?: number;
}

const PortfolioAnalysisCard: React.FC<PortfolioAnalysisCardProps> = ({ 
  isInView = true, 
  className,
  totalValue = 250000
}) => {
  // Default sectors
  const sectors: SectorAllocation[] = [
    { name: 'Technology', percentage: 42, color: 'rgb(59, 130, 246)', value: totalValue * 0.42 },
    { name: 'Healthcare', percentage: 18, color: 'rgb(16, 185, 129)', value: totalValue * 0.18 },
    { name: 'Consumer Cyclical', percentage: 15, color: 'rgb(99, 102, 241)', value: totalValue * 0.15 },
    { name: 'Financial Services', percentage: 12, color: 'rgb(245, 158, 11)', value: totalValue * 0.12 },
    { name: 'Other Sectors', percentage: 13, color: 'rgb(139, 92, 246)', value: totalValue * 0.13 },
  ];

  // Format data for pie chart
  const chartData = sectors.map(sector => ({
    name: sector.name,
    value: sector.value,
    percentage: sector.percentage
  }));

  return (
    <Card className={cn(
      'transition-all duration-700 transform',
      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
      className
    )}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Portfolio Analysis</CardTitle>
            <CardDescription>AI-optimized allocation</CardDescription>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            93% Optimized
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sectors[index].color} />
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {sectors.map((sector) => (
              <div key={sector.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: sector.color }}></span>
                    {sector.name}
                  </span>
                  <span className="font-medium">{sector.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${sector.percentage}%`, backgroundColor: sector.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Our AI suggests this allocation based on your risk profile, market conditions, and financial goals.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioAnalysisCard;
