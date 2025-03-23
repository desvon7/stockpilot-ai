
import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NewsCardImage from './card/NewsCardImage';
import NewsCardSentiment from './card/NewsCardSentiment';
import NewsCardSymbols from './card/NewsCardSymbols';
import NewsTimeAgo from './card/NewsTimeAgo';
import CompactNewsCard from './card/CompactNewsCard';
import FullNewsCard from './card/FullNewsCard';

export interface NewsItem {
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

export interface NewsCardProps {
  article: NewsItem;
  className?: string;
  showDate?: boolean;
  highlightSymbols?: string[];
  onSave?: (article: NewsItem) => void;
  compact?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  className,
  showDate = false,
  highlightSymbols = [],
  onSave,
  compact = false
}) => {
  if (compact) {
    return <CompactNewsCard article={article} className={className} />;
  }
  
  return <FullNewsCard article={article} className={className} onSave={onSave} />;
};

export default NewsCard;
