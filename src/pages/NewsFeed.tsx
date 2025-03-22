
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsCard from '@/components/news/NewsCard';
import { useStockNews } from '@/hooks/useStockNews';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const NewsFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // In a real app, these could come from user's watchlist
  const trackedSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  // Fetch news for tracked symbols
  const { news, isLoading, error } = useStockNews(trackedSymbols);

  // Fallback news data to display when API returns no results
  const fallbackNews = [
    {
      id: '1',
      title: 'Apple Reports Strong Q3 Earnings Exceeding Wall Street Expectations',
      summary: 'Apple Inc. reported quarterly earnings that surpassed analyst predictions, driven by robust iPhone sales and continued growth in services revenue. The company also announced a $90 billion share buyback program.',
      source: 'Market Watch',
      publishedAt: new Date().toISOString(),
      url: 'https://www.marketwatch.com',
      symbols: ['AAPL'],
      sentiment: 0.75
    },
    {
      id: '2',
      title: 'Microsoft Cloud Business Soars as AI Investments Begin to Pay Off',
      summary: 'Microsoft Corporation announced that its cloud services revenue grew by 27% year-over-year, with Azure seeing particularly strong adoption. CEO Satya Nadella credited the company\'s early investments in artificial intelligence capabilities.',
      source: 'Bloomberg',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://www.bloomberg.com',
      symbols: ['MSFT'],
      sentiment: 0.82
    },
    {
      id: '3',
      title: 'Tesla Delivers Record Number of Vehicles in Latest Quarter',
      summary: 'Tesla delivered more than 450,000 vehicles in the last quarter, setting a new record despite growing competition in the electric vehicle market. The company also made progress on its new Gigafactory in Mexico.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      url: 'https://www.reuters.com',
      symbols: ['TSLA'],
      sentiment: 0.68
    },
    {
      id: '4',
      title: 'Amazon Web Services Reports Accelerating Growth Rate',
      summary: 'Amazon's cloud division AWS reported a 34% growth rate, faster than the previous quarter. The acceleration comes as more enterprises move their infrastructure to the cloud and adopt AI capabilities.',
      source: 'CNBC',
      publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      url: 'https://www.cnbc.com',
      symbols: ['AMZN'],
      sentiment: 0.71
    },
    {
      id: '5',
      title: 'Google Unveils New AI Model to Power Next Generation of Bard',
      summary: 'Alphabet has introduced a new large language model that will power an upgraded version of its Bard AI assistant. The company claims the model achieves human-level performance on various benchmarks.',
      source: 'TechCrunch',
      publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      url: 'https://www.techcrunch.com',
      symbols: ['GOOGL'],
      sentiment: 0.65
    },
    {
      id: '6',
      title: 'Federal Reserve Signals Potential Rate Cut Later This Year',
      summary: 'In its latest meeting minutes, the Federal Reserve indicated it may begin cutting interest rates later this year if inflation continues to moderate. Markets rallied on the news, with technology stocks seeing the largest gains.',
      source: 'Financial Times',
      publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      url: 'https://www.ft.com',
      symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
      sentiment: 0.58
    },
  ];
  
  // Determine which news to display - use fallback if API returns no results
  const sourceNews = (!news || news.length === 0) && !isLoading ? fallbackNews : news;
  
  // Filter news by category if needed
  const filteredNews = activeCategory === 'all' 
    ? sourceNews 
    : sourceNews.filter(item => {
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

  if (error) {
    toast.error('Failed to fetch news. Showing fallback data instead.');
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Financial News | StockPilot</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Financial News</h1>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeCategory}>
            <Card>
              <CardHeader>
                <CardTitle>{activeCategory === 'all' ? 'Latest Financial News' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News`}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading news...</span>
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>No news articles found for this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((article) => (
                      <NewsCard key={article.id} article={article} className="h-full" />
                    ))}
                  </div>
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
