
import React from 'react';
import { useStockNews } from '@/hooks/useStockNews';
import NewsCard from '@/components/news/NewsCard';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StockNewsTabProps {
  stockName: string;
  symbol: string;
}

const StockNewsTab: React.FC<StockNewsTabProps> = ({ stockName, symbol }) => {
  const { news, newsSource, isLoading, error, refetch } = useStockNews([symbol]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Latest News</CardTitle>
            <CardDescription>Recent news and announcements about {stockName}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
            <span>Loading news...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-destructive bg-destructive/10 rounded-md p-4">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p className="font-medium">Error loading news</p>
            <p className="text-sm mt-1">Please try again later.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent news found for {stockName}.</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((newsItem) => (
              <NewsCard key={newsItem.id} article={newsItem} />
            ))}
          </div>
        )}
      </CardContent>
      {newsSource && news.length > 0 && (
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center">
            <span className="mr-2">News source:</span>
            <Badge variant="outline">{newsSource}</Badge>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default StockNewsTab;
