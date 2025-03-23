
export interface AssetSearchResult {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf';
  price?: number;
  change?: number;
}
