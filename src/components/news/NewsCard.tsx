import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/hooks/useStockNews';

interface NewsCardProps {
  article: NewsItem;
  className?: string;
  showDate?: boolean;
  highlightSymbols?: string[];
  compact?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  article, 
  className,
  showDate = false,
  highlightSymbols = [],
  compact = false
}) => {
  const isRecent = new Date(article.publishedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;
  
  const getCategories = () => {
    const categories: string[] = [];
    const text = (article.title + ' ' + article.summary).toLowerCase();
    
    const categoryKeywords = {
      Earnings: ['earnings', 'revenue', 'profit', 'quarterly', 'financial results'],
      Market: ['market', 'index', 'stocks', 'trading', 'investors'],
      Economy: ['economy', 'inflation', 'fed', 'federal reserve', 'interest rates'],
      Technology: ['technology', 'tech', 'ai', 'artificial intelligence', 'innovation'],
      Crypto: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'digital currency'],
    };
    
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(word => text.includes(word))) {
        categories.push(category);
      }
    });
    
    if (typeof article.sentiment === 'number') {
      if (article.sentiment > 0.3) categories.push('Positive');
      else if (article.sentiment < -0.3) categories.push('Negative');
    }
    
    return categories.length > 0 ? categories : ['General'];
  };

  const highlightText = (text: string) => {
    if (!highlightSymbols.length) return text;
    
    let result = text;
    for (const symbol of highlightSymbols) {
      const regex = new RegExp(`\\b${symbol}\\b`, 'g');
      result = result.replace(regex, `<span class="text-primary font-medium">${symbol}</span>`);
    }
    return result;
  };
  
  const categories = getCategories();

  if (compact) {
    return (
      <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">{article.source}</span>
            </div>
            {isRecent && <Badge variant="outline" className="bg-primary/10 text-primary text-xs">New</Badge>}
          </div>
          
          <h3 className="font-semibold text-sm mb-1" 
              dangerouslySetInnerHTML={{ __html: highlightText(article.title) }}></h3>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {categories.slice(0, 1).map((category, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  category === 'Positive' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                  category === 'Negative' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <span className="font-medium">{article.source}</span>
            {showDate && (
              <>
                <span className="mx-1">•</span>
                <span title={format(new Date(article.publishedAt), 'PPpp')}>
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </span>
              </>
            )}
          </div>
          {isRecent && <Badge variant="outline" className="bg-primary/10 text-primary text-xs">New</Badge>}
        </div>
        
        <h3 className="font-semibold text-md mb-2" 
            dangerouslySetInnerHTML={{ __html: highlightText(article.title) }}></h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3"
           dangerouslySetInnerHTML={{ __html: highlightText(article.summary) }}></p>
        
        <div className="flex flex-wrap gap-1 mt-2 mb-3">
          {categories.map((category, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={cn(
                "text-xs",
                category === 'Positive' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                category === 'Negative' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                category === 'Earnings' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                category === 'Market' && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                category === 'Economy' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              )}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="text-xs"
          >
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read More <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
