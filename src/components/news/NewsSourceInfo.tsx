
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface NewsSourceInfoProps {
  news: Array<any>;
  sourceCount: Record<string, number>;
  newsSource?: string;
}

const NewsSourceInfo: React.FC<NewsSourceInfoProps> = ({ news, sourceCount, newsSource }) => {
  if (news.length === 0 || Object.keys(sourceCount).length === 0 || !newsSource) {
    return null;
  }

  const sourceList = Object.entries(sourceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="bg-muted/40 p-3 rounded text-xs mb-4">
      <p className="text-muted-foreground flex items-center justify-between">
        <span className="flex items-center">
          <Info className="h-3 w-3 mr-1" />
          Data from: <Badge variant="outline" className="ml-1">{newsSource}</Badge>
        </span>
        <span className="flex items-center">
          <span className="mr-2">
            {Object.keys(sourceCount).length} publishers, {news.length} articles
          </span>
          <span className="hidden md:inline-flex">
            {sourceList.map(([source, count]) => (
              <Badge key={source} variant="secondary" className="mr-1 text-xs">
                {source.substring(0, 10)}{source.length > 10 ? '...' : ''}: {count}
              </Badge>
            ))}
          </span>
        </span>
      </p>
    </div>
  );
};

export default NewsSourceInfo;
