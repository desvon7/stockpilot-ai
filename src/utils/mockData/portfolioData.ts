
// Portfolio Data
export type PortfolioItem = {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
};

export const portfolioData: PortfolioItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 10,
    avgPrice: 150.25,
    currentPrice: 182.63
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 5,
    avgPrice: 350.10,
    currentPrice: 418.52
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 3,
    avgPrice: 800.75,
    currentPrice: 950.37
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 8,
    avgPrice: 160.30,
    currentPrice: 174.63
  },
  {
    symbol: 'EXOD',
    name: 'Exodus Movement, Inc.',
    shares: 10,
    avgPrice: 35.00,
    currentPrice: 46.80
  },
  {
    symbol: 'PEPE',
    name: 'Pepe',
    shares: 6473553,
    avgPrice: 0.00000008,
    currentPrice: 0.00000724
  }
];
