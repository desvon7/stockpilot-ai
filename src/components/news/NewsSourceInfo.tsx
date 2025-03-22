
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface NewsSourceInfoProps {
  news: Array<any>;
  sourceCount: Record<string, number>;
  newsSource?: string;
}

const NewsSourceInfo: React.FC<NewsSourceInfoProps> = ({ news, sourceCount, newsSource }) => {
  if (news.length === 0 || Object.keys(sourceCount).length === 0 || !newsSource) {
    return null;
  }

  return (
    <div className="bg-muted/40 p-2 rounded text-xs mb-4">
      <p className="text-muted-foreground flex items-center justify-between">
        <span>
          Source: <Badge variant="outline">{newsSource}</Badge>
        </span>
        <span>
          {Object.keys(sourceCount).length} publishers, {news.length} articles
        </span>
      </p>
    </div>
  );
};

export default NewsSourceInfo;
