
import { AlphaVantageResult } from "../types.ts";

export async function searchAlphaVantage(query: string, apiKey: string): Promise<AlphaVantageResult[] | null> {
  if (!apiKey) {
    console.log('No Alpha Vantage API key provided, skipping Alpha Vantage search');
    return null;
  }

  try {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.bestMatches && data.bestMatches.length > 0 && !data.Note) {
      // Add more stock types if needed
      return data.bestMatches.map((result: any) => {
        // Identify ETFs by their names
        if (result['2. name'].includes('ETF') && result['3. type'] !== 'ETF') {
          return { ...result, '3. type': 'ETF' };
        }
        return result;
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error searching Alpha Vantage:', error);
    return null;
  }
}
