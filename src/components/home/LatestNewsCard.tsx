
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { NewsItem } from '@/services/newsService';

interface LatestNewsCardProps {
  news: NewsItem[];
  isLoading: boolean;
  limit?: number;
}

const LatestNewsCard: React.FC<LatestNewsCardProps> = ({ 
  news, 
  isLoading, 
  limit = 3 
}) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5 text-muted-foreground" />
          Latest News for Your Portfolio
        </CardTitle>
        <CardDescription>Recent updates about your investments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center p-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading news...</p>
            </div>
          ) : news.length > 0 ? (
            news.slice(0, limit).map((item) => (
              <div key={item.id} className="flex border-b border-border pb-4">
                {item.imageUrl && (
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    {item.symbols && item.symbols.length > 0 && (
                      <div className="ml-2 flex gap-1">
                        {item.symbols.map(symbol => (
                          <Badge key={symbol} variant="secondary" className="text-xs">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4">
              <p className="text-muted-foreground">No news available for your portfolio</p>
            </div>
          )}
        </div>
        
        <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => navigate('/financial-news')}>
          View All News
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default LatestNewsCard;
