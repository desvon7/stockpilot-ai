
export interface Quote {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  bidSize?: number;
  askSize?: number;
  timestamp: number;
  previousClose?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
}

export interface Trade {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
  exchange: string;
}

export interface UseRealTimeMarketDataProps {
  symbols: string[];
  enabled?: boolean;
  onQuoteUpdate?: (symbol: string, quote: Quote) => void;
  onTradeUpdate?: (symbol: string, trade: Trade) => void;
}

export interface UseRealTimeMarketDataReturn {
  quotes: Record<string, Quote>;
  trades: Record<string, Trade>;
  isLoading: boolean;
  error: Error | null;
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  refresh: () => Promise<void>;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
