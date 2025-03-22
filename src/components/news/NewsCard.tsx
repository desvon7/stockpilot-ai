
import React from 'react';
import { cn } from '@/lib/utils';
import CompactNewsCard from './card/CompactNewsCard';
import FullNewsCard from './card/FullNewsCard';

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

interface NewsCardProps {
  article: NewsItem;
  onSave?: (article: NewsItem) => void;
  className?: string;
  compact?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  article, 
  onSave, 
  className,
  compact = false
}) => {
  if (compact) {
    return <CompactNewsCard article={article} className={className} />;
  }
  
  return <FullNewsCard article={article} onSave={onSave} className={className} />;
};

export default NewsCard;
