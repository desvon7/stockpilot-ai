
import { NewsItem } from "../types.ts";

// Use a fallback approach to get general financial news
export async function fetchFallbackNews(): Promise<NewsItem[]> {
  try {
    console.log('Fetching fallback general financial news');
    
    // Try to use Yahoo Finance API
    const response = await fetch(
      'https://yahoo-finance15.p.rapidapi.com/api/yahoo/ne/news',
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': Deno.env.get('RAPID_API_KEY') || '',
          'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
        },
        signal: AbortSignal.timeout(5000)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API returned ${response.status}`);
    }
    
    const data = await response.json();
    if (!data || !data.item || !Array.isArray(data.item)) {
      return [];
    }
    
    return data.item.map((item: any, index: number) => ({
      id: `yahoo-${index}-${Date.now()}`,
      title: item.title,
      summary: item.description,
      source: 'Yahoo Finance',
      publishedAt: new Date(item.pubDate).toISOString(),
      url: item.link,
      imageUrl: null,
      symbols: [],
      sentiment: null
    })).slice(0, 20);
  } catch (error) {
    console.error('Error fetching fallback news:', error);
    
    // Return static dummy news as last resort
    return [
      {
        id: `static-1-${Date.now()}`,
        title: 'Markets update: Major indices show mixed results',
        summary: 'Major stock indices showed mixed results today as investors evaluate the latest economic data and company earnings reports.',
        source: 'Financial News',
        publishedAt: new Date().toISOString(),
        url: 'https://finance.yahoo.com',
        symbols: ['SPY', 'QQQ', 'DIA'],
        sentiment: null
      },
      {
        id: `static-2-${Date.now()}`,
        title: 'Fed signals future rate decision based on incoming data',
        summary: 'The Federal Reserve indicated that future interest rate decisions will be heavily dependent on incoming economic data.',
        source: 'Market Watch',
        publishedAt: new Date().toISOString(),
        url: 'https://marketwatch.com',
        symbols: [],
        sentiment: null
      }
    ];
  }
}
