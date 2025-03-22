
import React from 'react';
import { Calendar, ExternalLink, ThumbsUp, ThumbsDown, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Calculate time ago for more user-friendly display
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
    
    // Less than an hour
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Default to formatted date
    return formattedDate;
  };
  
  // Determine sentiment status
  const getSentimentColor = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) return 'text-muted-foreground';
    if (sentiment > 0.25) return 'text-green-500 dark:text-green-400';
    if (sentiment < -0.25) return 'text-red-500 dark:text-red-400';
    return 'text-muted-foreground';
  };
  
  const getSentimentIcon = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) return null;
    return sentiment > 0 ? 
      <TrendingUp className="h-4 w-4 mr-1" /> : 
      <TrendingDown className="h-4 w-4 mr-1" />;
  };

  const openArticle = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  if (compact) {
    return (
      <div className={cn("border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer", className)} onClick={openArticle}>
        <div className="flex items-start gap-2">
          {article.imageUrl && (
            <div className="h-16 w-16 rounded overflow-hidden shrink-0">
              <img 
                src={article.imageUrl} 
                alt="" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight line-clamp-2 mb-1">{article.title}</h4>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="truncate">{article.source}</span>
              <span className="mx-1">•</span>
              <span>{getTimeAgo(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
          <Badge variant="outline" className="font-normal flex items-center text-xs">
            <Globe className="h-3 w-3 mr-1" />
            {article.source}
          </Badge>
          {article.sentiment !== undefined && article.sentiment !== null && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn("flex items-center text-sm", getSentimentColor(article.sentiment))}>
                    {getSentimentIcon(article.sentiment)}
                    <span>{Math.abs(Number(article.sentiment)).toFixed(2)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sentiment score: {article.sentiment > 0 ? 'Positive' : 'Negative'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardTitle className="text-xl line-clamp-2 hover:text-primary cursor-pointer" onClick={openArticle}>
          {article.title}
        </CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          <span title={formattedDate}>{getTimeAgo(article.publishedAt)}</span>
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

export default NewsCard;
