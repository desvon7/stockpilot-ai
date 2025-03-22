
import React from 'react';
import { Calendar, ExternalLink, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NewsCardImage from './NewsCardImage';
import NewsCardSentiment from './NewsCardSentiment';
import NewsCardSymbols from './NewsCardSymbols';
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

interface FullNewsCardProps {
  article: NewsItem;
  onSave?: (article: NewsItem) => void;
  className?: string;
}

const FullNewsCard: React.FC<FullNewsCardProps> = ({ article, onSave, className }) => {
  const openArticle = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={cn("overflow-hidden h-full flex flex-col", className)}>
      <NewsCardImage imageUrl={article.imageUrl} title={article.title} />
      
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="font-normal flex items-center text-xs">
            <Globe className="h-3 w-3 mr-1" />
            {article.source}
          </Badge>
          
          <NewsCardSentiment sentiment={article.sentiment} />
        </div>
        <CardTitle className="text-xl line-clamp-2 hover:text-primary cursor-pointer" onClick={openArticle}>
          {article.title}
        </CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          <NewsTimeAgo publishedAt={article.publishedAt} />
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3">{article.summary}</p>
        <NewsCardSymbols symbols={article.symbols} />
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3 border-t">
        <Button 
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 text-sm flex items-center"
          onClick={openArticle}
        >
          Read more <ExternalLink size={14} className="ml-1" />
        </Button>
        
        {onSave && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSave(article);
            }} 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Save for later
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FullNewsCard;
