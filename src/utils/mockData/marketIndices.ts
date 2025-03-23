
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
    value: 5283.95,
    change: 25.76,
    changePercent: 0.49
  },
  {
    id: '2',
    name: 'NASDAQ',
    value: 16808.15,
    change: 59.82,
    changePercent: 0.36
  },
  {
    id: '3',
    name: 'Dow Jones',
    value: 39172.32,
    change: -103.64,
    changePercent: -0.26
  },
  {
    id: '4',
    name: 'Russell 2000',
    value: 2101.54,
    change: 14.32,
    changePercent: 0.69
  }
];
