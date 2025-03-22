
import React from 'react';
import { cn } from '@/lib/utils';
import NewsCardImage from './NewsCardImage';
import NewsTimeAgo from './NewsTimeAgo';

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

interface CompactNewsCardProps {
  article: NewsItem;
  className?: string;
}

const CompactNewsCard: React.FC<CompactNewsCardProps> = ({ article, className }) => {
  const openArticle = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={cn("border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer", className)} 
      onClick={openArticle}
    >
      <div className="flex items-start gap-2">
        <NewsCardImage 
          imageUrl={article.imageUrl} 
          title={article.title} 
          compact 
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium leading-tight line-clamp-2 mb-1">{article.title}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="truncate">{article.source}</span>
            <span className="mx-1">•</span>
            <NewsTimeAgo publishedAt={article.publishedAt} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactNewsCard;
