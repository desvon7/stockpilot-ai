
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFinancialNews, NewsItem, useMockNews } from '@/services/newsService';
import { toast } from 'sonner';
import { generateMockNews } from '@/utils/mockDataGenerator';

export const useStockNews = (
  symbols: string[] = [],
  categories: string[] = ['general'],
  limit: number = 30
) => {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['stockNews', symbols.join(','), categories.join(','), limit],
    queryFn: () => fetchFinancialNews(symbols, categories, limit),
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to fetch news: ${error.message}`);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Handle no news case with mock data if needed
  const news: NewsItem[] = useMockNews || (!data?.news?.length && !isLoading) ? 
    generateMockNews(symbols, categories, limit) : 
    data?.news || [];

  // Extract news source info
  const newsSource = data?.sources ? 
    `Data from ${data.sources.length} sources including ${data.sources.slice(0, 3).join(', ')}` : 
    'Financial news sources';

  return {
    news,
    isLoading,
    error,
    refetch,
    isRefetching,
    newsSource,
    categories,
    symbols
  };
};

export default useStockNews;
