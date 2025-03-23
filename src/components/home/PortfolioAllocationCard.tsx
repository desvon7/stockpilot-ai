
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface SectorProps {
  name: string;
  percentage: number;
  color: string;
}

interface PortfolioAllocationCardProps {
  sectors: SectorProps[];
}

const PortfolioAllocationCard: React.FC<PortfolioAllocationCardProps> = ({ sectors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
          Portfolio Allocation
        </CardTitle>
        <CardDescription>Sector-based allocation of your investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sectors.map((sector) => (
            <div key={sector.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{sector.name}</span>
                <span className="font-medium">{sector.percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className={`h-2 ${sector.color} rounded-full`} style={{ width: `${sector.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioAllocationCard;
