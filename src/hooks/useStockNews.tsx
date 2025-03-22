
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
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stockNews', symbols.sort().join(','), categories?.join(',')],
    queryFn: async (): Promise<{news: NewsItem[], source?: string}> => {
      try {
        console.log(`Fetching news for symbols: ${symbols.join(', ')}`);
        
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
        toast.error('Failed to fetch financial news');
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  return {
    news: response?.news || [],
    newsSource: response?.source,
    isLoading,
    error,
    refetch
  };
};
