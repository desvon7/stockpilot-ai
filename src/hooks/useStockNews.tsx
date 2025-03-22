
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
        if (!symbols.length) return [];
        
        const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
          body: { 
            symbols,
            categories
          }
        });
        
        if (error) throw error;
        
        if (!data.news) return [];
        
        // Format news data for the frontend
        return data.news.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          source: item.source,
          publishedAt: item.published_at,
          url: item.url,
          imageUrl: item.image_url,
          symbols: item.symbols,
          sentiment: item.sentiment
        }));
      } catch (error) {
        console.error('Error fetching stock news:', error);
        toast.error('Failed to fetch financial news');
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: symbols.length > 0
  });
  
  return {
    news: news || [],
    isLoading,
    error,
    refetch
  };
};
