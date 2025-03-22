
import { NewsItem } from "../types.ts";

// Build a query for NewsAPI based on symbols
function buildNewsApiQuery(symbols: string[]): string {
  if (!symbols || symbols.length === 0) {
    return 'financial markets stocks investing';
  }
  
  // Map of stock symbols to company names
  const companyMap: Record<string, string> = {
    'AAPL': 'Apple',
    'MSFT': 'Microsoft',
    'GOOGL': 'Google Alphabet',
    'AMZN': 'Amazon',
    'TSLA': 'Tesla',
    'META': 'Meta Facebook',
    'NVDA': 'NVIDIA',
    'JPM': 'JPMorgan',
    'V': 'Visa',
    'JNJ': 'Johnson & Johnson',
    'WMT': 'Walmart',
    'PG': 'Procter & Gamble',
    'MA': 'Mastercard',
    'UNH': 'UnitedHealth',
    'HD': 'Home Depot',
    'BAC': 'Bank of America',
    'XOM': 'Exxon Mobil',
    'DIS': 'Disney',
    'NFLX': 'Netflix',
    'PYPL': 'PayPal',
    'ADBE': 'Adobe',
    'INTC': 'Intel',
    'CMCSA': 'Comcast',
    'PFE': 'Pfizer',
    'T': 'AT&T',
    'VZ': 'Verizon',
    'KO': 'Coca-Cola',
    'PEP': 'PepsiCo',
    'CSCO': 'Cisco',
    'CVX': 'Chevron',
    'SPY': 'S&P 500 ETF',
    'QQQ': 'Nasdaq ETF',
    'IWM': 'Russell 2000 ETF',
    'DIA': 'Dow Jones ETF'
  };
  
  // Build query with both symbols and company names
  const query = symbols.map(s => {
    if (companyMap[s]) {
      return `(${s} OR "${companyMap[s]}")`;
    }
    return s;
  }).join(' OR ');
  
  // Add financial terms to improve relevance
  return `(${query}) AND (stock OR market OR financial OR earnings OR investor)`;
}

// Try to fetch news from NewsAPI
export async function fetchNewsApi(symbols: string[]): Promise<NewsItem[]> {
  const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');
  
  if (!NEWS_API_KEY) {
    console.log('NewsAPI key not configured');
    return [];
  }

  try {
    console.log('Fetching news from NewsAPI');
    const query = buildNewsApiQuery(symbols);
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${NEWS_API_KEY}`,
      { signal: AbortSignal.timeout(8000) }
    );
    
    if (!response.ok) {
      throw new Error(`NewsAPI returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('NewsAPI response status:', data.status);
    
    if (!data.articles || data.articles.length === 0) {
      console.log('No news found from NewsAPI');
      return [];
    }
    
    // Map of stock symbols to company names (used for relevance checking)
    const companyMap: Record<string, string> = {
      'AAPL': 'Apple',
      'MSFT': 'Microsoft',
      'GOOGL': 'Google Alphabet',
      'AMZN': 'Amazon',
      'TSLA': 'Tesla',
      'META': 'Meta Facebook',
      'NVDA': 'NVIDIA',
      'JPM': 'JPMorgan'
    };
    
    const news = data.articles.map((item: any, index: number) => {
      // Extract relevant symbols from the article
      const articleSymbols = symbols.filter(symbol => 
        item.title?.includes(symbol) || 
        item.description?.includes(symbol) || 
        (companyMap[symbol] && 
          (item.title?.includes(companyMap[symbol]) || 
          item.description?.includes(companyMap[symbol])))
      );
      
      return {
        id: `news-api-${index}-${new Date(item.publishedAt).getTime()}`,
        title: item.title,
        summary: item.description || item.content,
        source: item.source.name,
        publishedAt: item.publishedAt,
        url: item.url,
        imageUrl: item.urlToImage,
        symbols: articleSymbols.length > 0 ? articleSymbols : symbols,
        sentiment: null // NewsAPI doesn't provide sentiment
      };
    });
    
    console.log(`Found ${news.length} articles from NewsAPI`);
    return news;
  } catch (newsApiError) {
    console.error('Error with NewsAPI:', newsApiError);
    return [];
  }
}
