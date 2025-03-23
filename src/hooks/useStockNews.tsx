
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
  categories?: string[];
}

export const useStockNews = (symbols: string[], categories?: string[]) => {
  // Create stable query keys by sorting arrays
  const sortedSymbols = [...symbols].sort().join(',');
  const sortedCategories = categories ? [...categories].sort().join(',') : undefined;
  
  const queryKey = ['stockNews', sortedSymbols, sortedCategories];
  
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: queryKey,
    queryFn: async (): Promise<{news: NewsItem[], source?: string}> => {
      try {
        console.log(`Fetching news for symbols: ${symbols.join(', ')}`);
        
        if (categories && categories.length > 0) {
          console.log(`With categories: ${categories.join(', ')}`);
        }
        
        if (!symbols || symbols.length === 0) {
          // Use general market news if no specific symbols provided
          console.log('No symbols provided, fetching general market news');
          const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
            body: { 
              symbols: ['SPY', 'QQQ', 'DIA'], // Major market ETFs as fallback
              categories
            }
          });
          
          if (error) {
            console.error('Error fetching general news:', error);
            throw error;
          }
          
          // Auto-categorize news if not already categorized
          if (data.news && data.news.length > 0) {
            data.news = categorizeNews(data.news);
          }
          
          return data;
        }
        
        const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
          body: { 
            symbols,
            categories
          }
        });
        
        if (error) {
          console.error('Error fetching stock news:', error);
          throw error;
        }
        
        // Auto-categorize news if not already categorized
        if (data.news && data.news.length > 0) {
          data.news = categorizeNews(data.news);
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching stock news:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      // Retry logic with exponential backoff
      console.log(`Retry attempt ${failureCount} for news fetch`);
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false
  });
  
  // Automatically categorize news if categories aren't provided
  const categorizeNews = (news: NewsItem[]): NewsItem[] => {
    return news.map(item => {
      if (item.categories && item.categories.length) {
        return item;
      }
      
      const categories: string[] = [];
      const text = (item.title + ' ' + item.summary).toLowerCase();
      
      // Basic category detection by keywords
      const categoryKeywords = {
        earnings: ['earnings', 'revenue', 'profit', 'quarterly', 'financial results'],
        market: ['market', 'index', 'stocks', 'trading', 'investors'],
        economy: ['economy', 'inflation', 'fed', 'federal reserve', 'interest rates'],
        technology: ['technology', 'tech', 'ai', 'artificial intelligence', 'innovation'],
        crypto: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'digital currency'],
      };
      
      Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        if (keywords.some(word => text.includes(word))) {
          categories.push(category);
        }
      });
      
      // Add mentioned symbols if available
      if (symbols.length > 0) {
        for (const symbol of symbols) {
          if (text.includes(symbol.toLowerCase())) {
            if (!item.symbols) {
              item.symbols = [symbol];
            } else if (!item.symbols.includes(symbol)) {
              item.symbols.push(symbol);
            }
          }
        }
      }
      
      // Basic sentiment analysis - this is a simple approach
      if (item.sentiment === undefined) {
        const positiveWords = ['surge', 'gain', 'jump', 'rise', 'positive', 'growth', 'profit', 'bullish', 'upward'];
        const negativeWords = ['fall', 'drop', 'plunge', 'decline', 'negative', 'loss', 'bearish', 'downward'];
        
        let sentiment = 0;
        
        positiveWords.forEach(word => {
          if (text.includes(word)) sentiment += 0.1;
        });
        
        negativeWords.forEach(word => {
          if (text.includes(word)) sentiment -= 0.1;
        });
        
        item.sentiment = Number(sentiment.toFixed(1));
      }
      
      return {
        ...item,
        categories: categories.length > 0 ? categories : ['general']
      };
    });
  };
  
  return {
    news: response?.news || [],
    newsSource: response?.source,
    isLoading,
    isRefetching: isFetching && !isLoading, // Add this line to provide isRefetching
    error,
    refetch
  };
};
