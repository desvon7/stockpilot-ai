
import { supabase } from '@/integrations/supabase/client';
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
  categories?: string[];
  sentiment?: number;
  provider?: string;
}

export interface NewsResponse {
  news: NewsItem[];
  sources: string[];
  errors?: string[] | null;
}

export const fetchFinancialNews = async (
  symbols: string[] = [],
  categories: string[] = ['general'],
  limit: number = 30
): Promise<NewsResponse> => {
  try {
    console.log(`Fetching news for symbols: [${symbols.join(', ')}], categories: [${categories.join(', ')}]`);
    
    const { data, error } = await supabase.functions.invoke('fetch-financial-news', {
      body: { symbols, categories, limit }
    });
    
    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('News service error:', error);
    toast.error('Failed to fetch financial news');
    // Return empty data on error
    return { news: [], sources: [] };
  }
};

export const useMockNews = false; // Set to false to use real news API
