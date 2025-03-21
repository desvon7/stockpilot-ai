
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Calendar, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, getColorByChange, getArrowByChange } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  timeAgo: string;
  imageUrl?: string;
  url: string;
  relatedSymbols?: string[];
}

const NewsFeed: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Can Europe stay on this roll?',
      summary: 'The European stock rally has been driven by momentum and increased government spending.',
      source: 'Investor\'s Guild',
      publishedAt: '2023-06-10',
      timeAgo: '2d',
      imageUrl: 'public/lovable-uploads/27c931e8-10c4-4c8c-ba4a-69994f1c808d.png',
      url: '#',
      relatedSymbols: ['EUFN', 'VGK', 'EZU']
    },
    {
      id: '2',
      title: 'Is Ford Stock a Buy Now?',
      summary: 'Ford Motor Co. (F) stock dropped 0.80% after announcing new electric vehicle production delays.',
      source: 'The Motley Fool',
      publishedAt: '2023-06-09',
      timeAgo: '36m',
      imageUrl: 'public/lovable-uploads/a54a67a7-8385-45ad-bbbe-8e96c916101b.png',
      url: '#',
      relatedSymbols: ['F', 'GM', 'TSLA']
    },
    {
      id: '3',
      title: 'Semiconductor stocks surge on AI demand',
      summary: 'Chip manufacturers see increased demand as AI applications require more computing power.',
      source: 'Market Watch',
      publishedAt: '2023-06-09',
      timeAgo: '4h',
      url: '#',
      relatedSymbols: ['NVDA', 'AMD', 'INTC']
    },
    {
      id: '4',
      title: 'Fed signals rates will remain higher for longer',
      summary: 'Federal Reserve indicates interest rates will remain elevated to combat persistent inflation.',
      source: 'Financial Times',
      publishedAt: '2023-06-08',
      timeAgo: '1d',
      url: '#',
      relatedSymbols: ['SPY', 'QQQ', 'DIA']
    },
    {
      id: '5',
      title: 'Oil prices drop on increased supply concerns',
      summary: 'Crude oil prices fell as OPEC+ members signal production increases despite weak global demand.',
      source: 'Energy Daily',
      publishedAt: '2023-06-07',
      timeAgo: '2d',
      url: '#',
      relatedSymbols: ['XOM', 'CVX', 'USO']
    }
  ];

  const marketIndices = [
    { name: 'S&P 500', value: '5,662.89', change: -0.22 },
    { name: 'Nasdaq', value: '17,691.63', change: -0.33 },
    { name: 'Bitcoin', value: '$83,670.30', change: -0.89 }
  ];

  return (
    <>
      <Helmet>
        <title>News Feed | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 pt-24 pb-16 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">News</h1>
            <button className="text-muted-foreground hover:text-foreground">
              <Info size={18} />
            </button>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {marketIndices.map((index) => (
              <div key={index.name}>
                <div className="text-2xl font-bold">{index.name}</div>
                <div className="text-lg font-semibold">{index.value}</div>
                <div className={cn("text-sm", getColorByChange(index.change))}>
                  {getArrowByChange(index.change)} {Math.abs(index.change)}%
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          {newsItems.map((news) => (
            <Card key={news.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {news.imageUrl && (
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={news.imageUrl ? "md:w-2/3" : "w-full"}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="font-medium">
                        {news.source}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{news.timeAgo}</span>
                    </div>
                    <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                    <CardDescription>{news.summary}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col items-start gap-2">
                    {news.relatedSymbols && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {news.relatedSymbols.map(symbol => (
                          <Badge key={symbol} variant="secondary">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Calendar size={14} className="mr-1" />
                      <span>{news.publishedAt}</span>
                      <a 
                        href={news.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center text-primary hover:underline"
                      >
                        Read more <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsFeed;
