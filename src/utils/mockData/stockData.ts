
// Stock Data
export type StockData = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  pe: number;
  dividend: number;
  sector: string;
  logo: string;
};

export const stockData: StockData[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.63,
    change: 2.45,
    changePercent: 1.36,
    marketCap: 2850000000000,
    volume: 62458963,
    pe: 30.2,
    dividend: 0.6,
    sector: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 418.52,
    change: 3.72,
    changePercent: 0.9,
    marketCap: 3110000000000,
    volume: 28563214,
    pe: 36.5,
    dividend: 0.8,
    sector: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 174.63,
    change: -1.25,
    changePercent: -0.71,
    marketCap: 2190000000000,
    volume: 22568741,
    pe: 25.8,
    dividend: 0,
    sector: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'
  },
  {
    id: '4',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 185.45,
    change: 1.87,
    changePercent: 1.02,
    marketCap: 1920000000000,
    volume: 34125689,
    pe: 42.1,
    dividend: 0,
    sector: 'Consumer Cyclical',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    id: '5',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 215.32,
    change: -4.56,
    changePercent: -2.07,
    marketCap: 685000000000,
    volume: 98562147,
    pe: 55.7,
    dividend: 0,
    sector: 'Automotive',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png'
  },
  {
    id: '6',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 509.03,
    change: 7.21,
    changePercent: 1.44,
    marketCap: 1300000000000,
    volume: 19875632,
    pe: 31.8,
    dividend: 0,
    sector: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'
  },
  {
    id: '7',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 950.37,
    change: 22.14,
    changePercent: 2.38,
    marketCap: 2350000000000,
    volume: 45896321,
    pe: 95.2,
    dividend: 0.04,
    sector: 'Technology',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg'
  },
  {
    id: '8',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 201.47,
    change: -1.23,
    changePercent: -0.61,
    marketCap: 580000000000,
    volume: 10254789,
    pe: 12.1,
    dividend: 2.6,
    sector: 'Financial Services',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/J.P._Morgan_Logo_2008_1.svg'
  }
];

// Export the mockStocks alias for the stockData
export const mockStocks = stockData;
