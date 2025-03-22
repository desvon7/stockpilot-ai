import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Quote {
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

interface Trade {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
  exchange: string;
}

interface UseRealTimeMarketDataProps {
  symbols: string[];
  enabled?: boolean;
  onQuoteUpdate?: (symbol: string, quote: Quote) => void;
  onTradeUpdate?: (symbol: string, trade: Trade) => void;
}

interface UseRealTimeMarketDataReturn {
  quotes: Record<string, Quote>;
  trades: Record<string, Trade>;
  isLoading: boolean;
  error: Error | null;
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  refresh: () => Promise<void>;
}

export const useRealTimeMarketData = ({ 
  symbols, 
  enabled = true,
  onQuoteUpdate,
  onTradeUpdate
}: UseRealTimeMarketDataProps): UseRealTimeMarketDataReturn => {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [trades, setTrades] = useState<Record<string, Trade>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const symbolsRef = useRef<string[]>(symbols);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    symbolsRef.current = symbols;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      updateSubscriptions();
    }
  }, [symbols]);
  
  const updateSubscriptions = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    wsRef.current.send(JSON.stringify({
      action: "subscribe",
      symbols: symbolsRef.current
    }));
  }, []);

  const fetchInitialData = useCallback(async () => {
    if (!symbols.length || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-real-time-market-data', {
        body: { symbols }
      });
      
      if (error) throw new Error(error.message);
      
      setQuotes(data.quotes || {});
    } catch (err) {
      console.error('Error fetching initial market data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch market data'));
      toast.error('Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  }, [symbols, enabled]);
  
  useEffect(() => {
    if (!enabled || !symbols.length) return;
    
    fetchInitialData();
    
    const connectWebSocket = () => {
      try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        let wsUrl = '';
        
        if (import.meta.env.MODE === 'development') {
          wsUrl = `${wsProtocol}//${window.location.hostname}:54321/functions/v1/stock-market-websocket`;
        } else {
          wsUrl = `wss://fansbktmwnskvolllfhk.supabase.co/functions/v1/stock-market-websocket`;
        }
        
        setWsStatus('connecting');
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setWsStatus('connected');
          toast.success('Connected to real-time market data');
          
          ws.send(JSON.stringify({
            action: "subscribe",
            symbols: symbolsRef.current
          }));
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (Array.isArray(data)) {
              data.forEach(item => {
                if (item.T === 'q') {
                  const quoteUpdate: Quote = {
                    symbol: item.S,
                    price: (item.ap || item.bp) || 0,
                    bid: item.bp || 0,
                    ask: item.ap || 0,
                    bidSize: item.bs,
                    askSize: item.as,
                    timestamp: item.t,
                  };
                  
                  setQuotes(prev => {
                    const prevQuote = prev[item.S] || {} as Quote;
                    const newQuote = {
                      ...prevQuote,
                      ...quoteUpdate
                    };
                    
                    if (prevQuote.previousClose !== undefined) {
                      newQuote.change = newQuote.price - prevQuote.previousClose;
                      newQuote.changePercent = (newQuote.change / prevQuote.previousClose) * 100;
                    }
                    
                    if (onQuoteUpdate) {
                      onQuoteUpdate(item.S, newQuote);
                    }
                    
                    return {
                      ...prev,
                      [item.S]: newQuote
                    };
                  });
                } else if (item.T === 't') {
                  const tradeUpdate: Trade = {
                    symbol: item.S,
                    price: item.p || 0,
                    size: item.s || 0,
                    timestamp: item.t,
                    exchange: item.x || '',
                  };
                  
                  setTrades(prev => {
                    const newTrades = {
                      ...prev,
                      [item.S]: tradeUpdate
                    };
                    
                    if (onTradeUpdate) {
                      onTradeUpdate(item.S, tradeUpdate);
                    }
                    
                    return newTrades;
                  });
                  
                  setQuotes(prev => {
                    if (!prev[item.S]) return prev;
                    
                    const volume = (prev[item.S].volume || 0) + (item.s || 0);
                    return {
                      ...prev,
                      [item.S]: {
                        ...prev[item.S],
                        volume
                      }
                    };
                  });
                }
              });
            } else if (data.type === 'status') {
              console.log('WebSocket status:', data.status);
              
              if (data.status === 'authenticated') {
                console.log('WebSocket authenticated with data provider');
              } else if (data.status === 'disconnected') {
                console.warn('WebSocket disconnected from data provider:', data.message);
                toast.warning('Real-time data connection interrupted. Reconnecting...');
              }
            } else if (data.type === 'subscription') {
              console.log(`Subscription ${data.status}:`, data.symbols);
            } else if (data.type === 'error') {
              console.error('WebSocket error message:', data.message);
              toast.error(`WebSocket error: ${data.message}`);
            }
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };
        
        ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          setWsStatus('error');
          toast.error('WebSocket connection error');
        };
        
        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          setWsStatus('disconnected');
          
          const reconnectDelay = reconnectTimeoutRef.current ? Math.min(30000, (reconnectTimeoutRef.current * 1.5)) : 3000;
          console.log(`Attempting to reconnect in ${reconnectDelay}ms`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            if (enabled) {
              toast.info('Attempting to reconnect to market data...');
              connectWebSocket();
            }
          }, reconnectDelay);
        };
        
        return ws;
      } catch (err) {
        console.error('Error establishing WebSocket connection:', err);
        setWsStatus('error');
        toast.error('Failed to establish WebSocket connection');
        return null;
      }
    };
    
    const ws = connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN && symbolsRef.current.length > 0) {
          wsRef.current.send(JSON.stringify({
            action: "unsubscribe",
            symbols: symbolsRef.current
          }));
        }
        
        wsRef.current.close();
        wsRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [enabled, fetchInitialData, onQuoteUpdate, onTradeUpdate]);
  
  const refresh = async () => {
    await fetchInitialData();
    toast.success('Market data refreshed');
  };
  
  return {
    quotes,
    trades,
    isLoading,
    error,
    wsStatus,
    refresh
  };
};

export default useRealTimeMarketData;
