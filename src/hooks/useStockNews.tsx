
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
          
          console.log(`Received general news response:`, data);
          
          if (!data.news || data.news.length === 0) {
            console.log('No general news returned from API');
            return { news: [] };
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
        
        console.log(`Received news response for ${symbols.join(',')}:`, data);
        
        if (!data.news || data.news.length === 0) {
          console.log('No news returned from API for the specified symbols');
          return { news: [] };
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
  
  return {
    news: response?.news || [],
    newsSource: response?.source,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};
