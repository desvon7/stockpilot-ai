
import { NewsItem } from "../types.ts";

// Try to fetch news from Finnhub API
export async function fetchFinnhubNews(symbols: string[]): Promise<NewsItem[]> {
  const FINN_HUB_API_KEY = Deno.env.get('FINN_HUB_API_KEY');
  
  if (!FINN_HUB_API_KEY) {
    console.log('Finnhub API key not configured');
    return [];
  }

  try {
    console.log(`Fetching Finnhub news for symbols: ${symbols.join(',')}`);
    // Get date range for past month
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const fromDate = oneMonthAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // Finnhub requires separate requests for each symbol
    const newsPromises = symbols.map(async (symbol) => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${FINN_HUB_API_KEY}`,
          { signal: AbortSignal.timeout(5000) }
        );
        
        if (!response.ok) {
          throw new Error(`Finnhub API returned ${response.status}: ${response.statusText}`);
        }
        
        const items = await response.json();
        console.log(`Finnhub returned ${items?.length || 0} news items for ${symbol}`);
        
        return items.map((item: any) => ({
          id: `${item.id || item.headline.replace(/\s+/g, '-').toLowerCase() + '-' + new Date(item.datetime * 1000).getTime()}`,
          title: item.headline,
          summary: item.summary,
          source: item.source,
          publishedAt: new Date(item.datetime * 1000).toISOString(),
          url: item.url,
          imageUrl: item.image,
          symbols: [symbol],
          sentiment: item.sentiment
        }));
      } catch (error) {
        console.error(`Error fetching Finnhub news for ${symbol}:`, error);
        return [];
      }
    });
    
    const allNews = await Promise.all(newsPromises);
    const news = allNews.flat().filter(Boolean);
    
    console.log(`Found ${news.length} articles from Finnhub`);
    return news;
  } catch (finnhubError) {
    console.error('Error with Finnhub API:', finnhubError);
    return [];
  }
}
