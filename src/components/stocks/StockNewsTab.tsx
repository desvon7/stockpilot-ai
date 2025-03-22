
import React from 'react';
import { useStockNews } from '@/hooks/useStockNews';
import NewsCard from '@/components/news/NewsCard';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface StockNewsTabProps {
  stockName: string;
  symbol: string;
}

const StockNewsTab: React.FC<StockNewsTabProps> = ({ stockName, symbol }) => {
  const { news, isLoading, error } = useStockNews([symbol]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
        <CardDescription>Recent news and announcements about {stockName}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Loading news...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-destructive">
            <p>Error loading news. Please try again later.</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent news found for {stockName}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((newsItem) => (
              <NewsCard key={newsItem.id} article={newsItem} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockNewsTab;
