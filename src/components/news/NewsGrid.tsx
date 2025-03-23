
import React from 'react';
import { Loader2 } from 'lucide-react';
import NewsCard from './NewsCard';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  symbols?: string[];
  sentiment?: number;
}

interface NewsGridProps {
  news: NewsItem[];
  displayedNews: NewsItem[];
  isLoading: boolean;
  compact?: boolean;
}

const NewsGrid: React.FC<NewsGridProps> = ({ 
  news, 
  displayedNews, 
  isLoading, 
  compact = false 
}) => {
  const getCardStyle = () => {
    if (compact) {
      return "grid grid-cols-1 gap-4";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  };

  return (
    <>
      <div className={getCardStyle()}>
        {isLoading && news.length === 0 ? (
          // Skeleton loading state
          Array(compact ? 3 : 6).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[180px] w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))
        ) : (
          displayedNews.map(article => (
            <NewsCard 
              key={article.id} 
              article={article} 
              compact={compact}
            />
          ))
        )}
      </div>
      
      {isLoading && news.length > 0 && (
        <div className="w-full flex justify-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </>
  );
};

export default NewsGrid;
