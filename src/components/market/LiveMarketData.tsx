
import React, { useState } from 'react';
import { useMarketData, MarketDataItem } from '@/hooks/useMarketData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpCircle, ArrowDownCircle, BarChart3, RefreshCw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface MarketDataTabProps {
  items: MarketDataItem[];
  icon: React.ReactNode;
  title: string;
  isLoading: boolean;
}

const MarketDataTab: React.FC<MarketDataTabProps> = ({ items, icon, title, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-md">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-5 w-16 ml-auto" />
              <Skeleton className="h-4 w-12 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items && items.length > 0 ? (
        items.map((item, index) => {
          const isPositive = !item.change_percentage.includes('-');
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
            >
              <div>
                <p className="font-medium">{item.ticker}</p>
                <p className="text-sm text-muted-foreground">
                  Vol: {parseInt(item.volume).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${parseFloat(item.price).toFixed(2)}</p>
                <p className={cn(
                  "text-sm flex items-center justify-end gap-1",
                  isPositive ? "text-success" : "text-destructive"
                )}>
                  {isPositive ? "+" : ""}{item.change_percentage}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
};

const LiveMarketData: React.FC<{ className?: string }> = ({ className }) => {
  const { data, isLoading, lastUpdated, refreshData } = useMarketData();
  const [activeTab, setActiveTab] = useState('active');
  
  const handleRefresh = () => {
    refreshData();
  };
  
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Live Market Data</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw size={16} className={cn(isLoading && "animate-spin")} />
          </Button>
        </div>
        <CardDescription className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {lastUpdated 
            ? `Last updated: ${format(lastUpdated, 'hh:mm a')}`
            : 'Fetching data...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="active" className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Most Active</span>
              <span className="sm:hidden">Active</span>
            </TabsTrigger>
            <TabsTrigger value="gainers" className="flex items-center gap-1.5">
              <ArrowUpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Top Gainers</span>
              <span className="sm:hidden">Gainers</span>
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center gap-1.5">
              <ArrowDownCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Top Losers</span>
              <span className="sm:hidden">Losers</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <MarketDataTab 
              items={data?.most_actively_traded || []} 
              icon={<BarChart3 />}
              title="Most Active"
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="gainers">
            <MarketDataTab 
              items={data?.top_gainers || []} 
              icon={<ArrowUpCircle />}
              title="Top Gainers"
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="losers">
            <MarketDataTab 
              items={data?.top_losers || []} 
              icon={<ArrowDownCircle />}
              title="Top Losers"
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-1 text-sm text-muted-foreground">
        <p>Data provided by Alpha Vantage</p>
      </CardFooter>
    </Card>
  );
};

export default LiveMarketData;
