
import React from 'react';
import { Calendar, ExternalLink, ThumbsUp, ThumbsDown, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onSave, className }) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Determine sentiment status
  const getSentimentColor = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) return 'text-muted-foreground';
    if (sentiment > 0.25) return 'text-green-500 dark:text-green-400';
    if (sentiment < -0.25) return 'text-red-500 dark:text-red-400';
    return 'text-muted-foreground';
  };
  
  const getSentimentIcon = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) return null;
    return sentiment > 0 ? <ThumbsUp className="h-4 w-4 mr-1" /> : <ThumbsDown className="h-4 w-4 mr-1" />;
  };

  const openArticle = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <Card className={cn("overflow-hidden h-full flex flex-col", className)}>
      {article.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              // Hide image container if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.style.display = 'none';
              }
            }}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="font-medium flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            {article.source}
          </Badge>
          {article.sentiment !== undefined && article.sentiment !== null && (
            <div className={cn("flex items-center text-sm", getSentimentColor(article.sentiment))}>
              {getSentimentIcon(article.sentiment)}
              <span>{Math.abs(Number(article.sentiment)).toFixed(2)}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-xl line-clamp-2 hover:text-primary cursor-pointer" onClick={openArticle}>
          {article.title}
        </CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formattedDate}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3">{article.summary}</p>
        
        {article.symbols && article.symbols.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.symbols.map(symbol => (
              <Badge key={symbol} variant="secondary" className="text-xs">
                {symbol}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        <Button 
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary-focus text-sm flex items-center"
          onClick={openArticle}
        >
          Read more <ExternalLink size={14} className="ml-1" />
        </Button>
        
        {onSave && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onSave(article)} 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Save for later
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
