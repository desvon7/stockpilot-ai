
// Market Indices
export type MarketIndex = {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
};

export const marketIndices: MarketIndex[] = [
  {
    id: '1',
    name: 'S&P 500',
    value: 5258.19,
    change: 38.45,
    changePercent: 0.74
  },
  {
    id: '2',
    name: 'NASDAQ',
    value: 16748.33,
    change: 183.02,
    changePercent: 1.10
  },
  {
    id: '3',
    name: 'Dow Jones',
    value: 39275.96,
    change: 15.35,
    changePercent: 0.04
  },
  {
    id: '4',
    name: 'Russell 2000',
    value: 2043.90,
    change: -2.78,
    changePercent: -0.14
  }
];
