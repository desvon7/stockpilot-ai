
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStockNews } from '@/hooks/useStockNews';
import { toast } from 'sonner';
import LoadingState from '@/components/ui/LoadingState';
import NewsGrid from '@/components/news/NewsGrid';
import NewsErrorState from '@/components/news/states/NewsErrorState';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import NewsPagination from '@/components/news/pagination/NewsPagination';

const NewsFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Popular tech and financial stocks for news tracking
  const trackedSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  // Fetch news for tracked symbols
  const { news, isLoading, error, refetch, isRefetching } = useStockNews(trackedSymbols);
  
  // Filter news by category if needed
  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => {
        const lowerTitle = item.title.toLowerCase();
        const lowerSummary = item.summary.toLowerCase();
        
        switch(activeCategory) {
          case 'earnings':
            return lowerTitle.includes('earnings') || 
                   lowerTitle.includes('revenue') ||
                   lowerSummary.includes('earnings') ||
                   lowerSummary.includes('quarterly');
          case 'market':
            return lowerTitle.includes('market') ||
                   lowerTitle.includes('index') ||
                   lowerTitle.includes('stocks') ||
                   lowerSummary.includes('market') ||
                   lowerTitle.includes('fed') ||
                   lowerTitle.includes('federal reserve') ||
                   lowerSummary.includes('rate') ||
                   lowerSummary.includes('investor');
          case 'tech':
            return lowerTitle.includes('tech') ||
                   lowerTitle.includes('technology') ||
                   lowerSummary.includes('technology') ||
                   lowerSummary.includes('ai') ||
                   lowerSummary.includes('artificial intelligence') ||
                   lowerSummary.includes('cloud');
          default:
            return true;
        }
      });

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Get current page items
  const currentItems = filteredNews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    toast.error('Failed to fetch news data. Please try again later.');
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Financial News | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Financial News</h1>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6 w-full sm:w-auto flex overflow-x-auto py-1">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory}>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>{activeCategory === 'all' ? 'Latest Financial News' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News`}</CardTitle>
                    <CardDescription>
                      Updates and insights to help you stay informed about the financial markets
                    </CardDescription>
                  </div>
                  
                  {!isLoading && !error && filteredNews.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <select 
                        className="bg-background border border-input rounded-md text-sm px-2 py-1"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        <option value={6}>6 per page</option>
                        <option value={12}>12 per page</option>
                        <option value={24}>24 per page</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LoadingState 
                    variant="skeleton" 
                    count={6}
                  />
                ) : error ? (
                  <NewsErrorState refetch={refetch} />
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No news articles found for this category.</p>
                  </div>
                ) : (
                  <>
                    <NewsGrid 
                      news={filteredNews} 
                      displayedNews={currentItems} 
                      isLoading={false}
                      isLoadingMore={isRefetching}
                    />
                    
                    {filteredNews.length > itemsPerPage && (
                      <NewsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NewsFeed;
