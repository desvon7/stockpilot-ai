
import { NewsItem } from "../types.ts";

// Try to fetch news from Alpha Vantage API
export async function fetchAlphaVantageNews(tickers: string): Promise<NewsItem[]> {
  const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
  
  if (!ALPHA_VANTAGE_API_KEY) {
    console.log('Alpha Vantage API key not configured');
    return [];
  }

  try {
    console.log(`Fetching Alpha Vantage news for symbols: ${tickers}`);
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      { signal: AbortSignal.timeout(10000) } // 10 second timeout
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Alpha Vantage response:', JSON.stringify(data).slice(0, 200) + '...');
    
    if (!data.feed || data.feed.length === 0) {
      console.log('No news found from Alpha Vantage');
      return [];
    }
    
    const news = data.feed.map((item: any) => ({
      id: item.title.replace(/\s+/g, '-').toLowerCase() + '-' + new Date(item.time_published).getTime(),
      title: item.title,
      url: item.url,
      source: item.source,
      summary: item.summary,
      imageUrl: item.banner_image || null,
      publishedAt: item.time_published,
      sentiment: item.overall_sentiment_score,
      symbols: item.ticker_sentiment
        ? item.ticker_sentiment.map((ticker: any) => ticker.ticker)
        : []
    }));
    
    console.log(`Found ${news.length} articles from Alpha Vantage`);
    return news;
  } catch (alphaError) {
    console.error('Error with Alpha Vantage API:', alphaError);
    return [];
  }
}
