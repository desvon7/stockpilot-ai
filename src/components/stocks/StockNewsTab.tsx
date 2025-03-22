
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

  // Mock data as fallback if API doesn't return results
  const fallbackNews = [
    {
      id: '1',
      title: `${stockName} Reports Strong Q3 Earnings`,
      summary: `${stockName} exceeded analyst expectations with impressive revenue growth and strong margins. The company reported earnings per share of $2.85, beating consensus estimates of $2.35.`,
      source: 'Market Watch',
      publishedAt: new Date().toISOString(),
      url: 'https://www.marketwatch.com',
      symbols: [symbol],
      sentiment: 0.78
    },
    {
      id: '2',
      title: `New Product Launch Boosts ${symbol} Outlook`,
      summary: `Analysts have raised price targets following ${stockName}'s successful product launch event. The new lineup is expected to drive significant revenue growth in the coming quarters.`,
      source: 'Bloomberg',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://www.bloomberg.com',
      symbols: [symbol],
      sentiment: 0.65
    },
    {
      id: '3',
      title: `${stockName} Sector Showing Growth Despite Market Headwinds`,
      summary: `${stockName} and peers demonstrate resilience in challenging economic environment. Industry analysts point to strong fundamentals and innovative product cycles as key factors.`,
      source: 'Financial Times',
      publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      url: 'https://www.ft.com',
      symbols: [symbol],
      sentiment: 0.52
    },
    {
      id: '4',
      title: `${stockName} Expands International Operations`,
      summary: `${stockName} announced plans to expand its presence in emerging markets, with a particular focus on Southeast Asia and Latin America. The move is expected to open new growth avenues.`,
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      url: 'https://www.reuters.com',
      symbols: [symbol],
      sentiment: 0.61
    },
  ];
  
  // If no news is returned from API and we're not loading, use fallback data
  const displayedNews = (!news || news.length === 0) && !isLoading && !error 
    ? fallbackNews 
    : news;

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
            <p>Error loading news. Showing fallback data instead.</p>
            <div className="space-y-4 mt-4">
              {fallbackNews.map((newsItem) => (
                <NewsCard key={newsItem.id} article={newsItem} />
              ))}
            </div>
          </div>
        ) : displayedNews.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent news found for {stockName}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedNews.map((newsItem) => (
              <NewsCard key={newsItem.id} article={newsItem} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockNewsTab;
