
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PolygonStockChart from '@/components/market/PolygonStockChart';
import { useQuery } from '@tanstack/react-query';
import { getTickerDetails, PolygonTickerDetails } from '@/services/polygonService';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface PolygonDataSectionProps {
  symbol: string;
}

const PolygonDataSection: React.FC<PolygonDataSectionProps> = ({ symbol }) => {
  const { data: tickerDetails, isLoading } = useQuery({
    queryKey: ['polygon-ticker-details', symbol],
    queryFn: () => getTickerDetails(symbol),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <PolygonStockChart 
            symbol={symbol} 
            title={`${symbol} Price History`}
            description="Powered by Polygon.io API"
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Provided by Polygon.io</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : tickerDetails ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium">{tickerDetails.name}</div>
                    <div className="text-muted-foreground">
                      {tickerDetails.market} • {tickerDetails.locale}
                    </div>
                  </div>
                  
                  {tickerDetails.description && (
                    <div>
                      <div className="text-muted-foreground mb-1">Description</div>
                      <p className="text-sm">{tickerDetails.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    {tickerDetails.market_cap && (
                      <div>
                        <div className="text-muted-foreground text-xs">Market Cap</div>
                        <div>{formatCurrency(tickerDetails.market_cap)}</div>
                      </div>
                    )}
                    
                    {tickerDetails.primary_exchange && (
                      <div>
                        <div className="text-muted-foreground text-xs">Exchange</div>
                        <div>{tickerDetails.primary_exchange}</div>
                      </div>
                    )}
                    
                    {tickerDetails.list_date && (
                      <div>
                        <div className="text-muted-foreground text-xs">Listed Date</div>
                        <div>{new Date(tickerDetails.list_date).toLocaleDateString()}</div>
                      </div>
                    )}
                    
                    {tickerDetails.total_employees && (
                      <div>
                        <div className="text-muted-foreground text-xs">Employees</div>
                        <div>{tickerDetails.total_employees.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  
                  {tickerDetails.homepage_url && (
                    <a 
                      href={tickerDetails.homepage_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      Visit Website
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No company information available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PolygonDataSection;
