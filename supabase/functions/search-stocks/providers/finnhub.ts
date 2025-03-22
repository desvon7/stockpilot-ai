
import { StockSearchResult } from "../types.ts";

export async function searchFinnhub(query: string, apiKey: string): Promise<StockSearchResult[] | null> {
  if (!apiKey) {
    console.log('No Finnhub API key provided, skipping Finnhub search');
    return null;
  }
  
  try {
    const url = `https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Finnhub API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result || data.result.length === 0) {
      return null;
    }
    
    // Transform Finnhub data to match our format
    return data.result.map((item: any) => ({
      symbol: item.symbol,
      name: item.description,
      type: item.type === 'Common Stock' ? 'Equity' : item.type,
      region: 'United States',
      marketOpen: '09:30',
      marketClose: '16:00',
      timezone: 'UTC-05',
      currency: 'USD',
      matchScore: '1.0000'
    }));
  } catch (error) {
    console.error('Error searching Finnhub:', error);
    return null;
  }
}
