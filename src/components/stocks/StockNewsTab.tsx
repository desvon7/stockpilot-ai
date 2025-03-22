
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
}

interface StockNewsTabProps {
  stockName: string;
  news: NewsItem[];
}

const StockNewsTab: React.FC<StockNewsTabProps> = ({ stockName, news }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
        <CardDescription>Recent news and announcements about {stockName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((newsItem) => (
            <div key={newsItem.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium">{newsItem.title}</h3>
                <Badge variant="outline" className="ml-2 whitespace-nowrap">
                  {newsItem.source}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{newsItem.summary}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{newsItem.date}</span>
                </div>
                <a 
                  href={newsItem.url} 
                  className="text-primary hover:underline flex items-center"
                >
                  Read more <ChevronRight className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockNewsTab;
