
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { NewsItem } from '@/services/newsService';

interface NewsTabProps {
  news: NewsItem[];
  isLoading: boolean;
}

const NewsTab: React.FC<NewsTabProps> = ({ news, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading latest news...</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {news.map((item) => (
            <div key={item.id} className="flex border-b border-border pb-6">
              {item.imageUrl && (
                <div className="flex-shrink-0 mr-6">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-32 h-24 object-cover rounded-md"
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-muted-foreground mt-2">{item.summary}</p>
                <div className="flex items-center mt-3">
                  <span className="text-sm text-muted-foreground">
                    {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                  {item.symbols && item.symbols.length > 0 && (
                    <div className="ml-4 flex gap-1">
                      {item.symbols.map(symbol => (
                        <Badge key={symbol} variant="secondary">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsTab;
