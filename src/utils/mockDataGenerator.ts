
import { NewsItem } from '@/services/newsService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates mock financial news articles
 * Used as a fallback when the news API doesn't return results
 */
export const generateMockNews = (
  symbols: string[] = [],
  categories: string[] = ['general'],
  limit: number = 10
): NewsItem[] => {
  const mockNews: NewsItem[] = [];
  const today = new Date();
  const stockTickers = symbols.length > 0 ? symbols : ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  
  // Generate mock news headlines based on symbols and categories
  const headlines = [
    { title: 'Market Update: Stocks Rally on Economic Data', category: 'market' },
    { title: 'Fed Signals Possible Rate Changes in Coming Months', category: 'economy' },
    { title: 'Earnings Season: What Investors Need to Know', category: 'earnings' },
    { title: 'Tech Sector Leads Market Gains as Confidence Returns', category: 'technology' },
    { title: 'Healthcare Stocks Show Resilience Amid Market Volatility', category: 'healthcare' },
    { title: 'Retail Sales Data Exceeds Expectations', category: 'retail' },
    { title: 'Energy Sector Responds to Global Supply Concerns', category: 'energy' },
    { title: 'Financial Stocks Rise on Banking Regulation Updates', category: 'financial' },
    { title: 'Consumer Sentiment Improves as Inflation Pressures Ease', category: 'consumer' },
    { title: 'Manufacturing Activity Expands for Third Consecutive Month', category: 'manufacturing' }
  ];
  
  // Generate company-specific headlines for the requested symbols
  const companyHeadlines = stockTickers.flatMap(symbol => [
    { 
      title: `${symbol} Reports Quarterly Earnings Above Expectations`, 
      category: 'earnings',
      symbols: [symbol]
    },
    { 
      title: `Analysts Raise Price Target for ${symbol} on Growth Outlook`, 
      category: 'analysis',
      symbols: [symbol]
    },
    { 
      title: `${symbol} Announces New Product Line, Shares React`, 
      category: 'products',
      symbols: [symbol]
    },
    { 
      title: `${symbol} Expands Operations in International Markets`, 
      category: 'expansion',
      symbols: [symbol]
    }
  ]);
  
  // Combine general and company-specific headlines
  const allHeadlines = [...headlines, ...companyHeadlines];
  
  // Filter by categories if specified
  const filteredHeadlines = categories.includes('general') 
    ? allHeadlines 
    : allHeadlines.filter(headline => 
        categories.includes(headline.category) || 
        (headline.symbols && headline.symbols.some(s => symbols.includes(s)))
      );
  
  // Generate the requested number of mock news items
  for (let i = 0; i < Math.min(limit, filteredHeadlines.length); i++) {
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const publishDate = new Date(today);
    publishDate.setHours(today.getHours() - randomHours);
    publishDate.setMinutes(today.getMinutes() - randomMinutes);
    
    const headline = filteredHeadlines[i];
    
    mockNews.push({
      id: uuidv4(),
      title: headline.title,
      summary: `This is a mock summary for "${headline.title}". It provides additional context and details about the news story. This would typically contain several sentences with key information.`,
      source: ['Bloomberg', 'CNBC', 'Reuters', 'Financial Times', 'Wall Street Journal'][Math.floor(Math.random() * 5)],
      publishedAt: publishDate.toISOString(),
      url: 'https://example.com/financial-news',
      imageUrl: `https://picsum.photos/seed/${i + 1}/800/400`,
      symbols: headline.symbols || [],
      categories: [headline.category],
      sentiment: Math.random() * 2 - 1, // Random sentiment between -1 and 1
      provider: 'mock-data'
    });
  }
  
  return mockNews;
};
