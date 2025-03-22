
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

export const useStockNews = (symbols: string[], categories?: string[]) => {
  const {
    data: news,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stockNews', symbols.sort().join(','), categories?.join(',')],
    queryFn: async (): Promise<NewsItem[]> => {
      try {
        if (!symbols || symbols.length === 0) {
          // Use general market news if no specific symbols provided
          const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
            body: { 
              symbols: ['SPY', 'QQQ', 'DIA'], // Major market ETFs as fallback
              categories
            }
          });
          
          if (error) throw error;
          
          if (!data.news || data.news.length === 0) {
            console.log('No news returned from API');
            return [];
          }
          
          return data.news;
        }
        
        const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
          body: { 
            symbols,
            categories
          }
        });
        
        if (error) throw error;
        
        if (!data.news || data.news.length === 0) {
          console.log('No news returned from API for the specified symbols');
          return [];
        }
        
        return data.news;
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
    news: news || [],
    isLoading,
    error,
    refetch
  };
};
