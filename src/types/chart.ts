
export interface ChartData {
  date: string;
  value: number;
  price?: number;  // Added optional price field for compatibility with StockChart
}
