
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  Quote, 
  Trade, 
  UseRealTimeMarketDataProps, 
  UseRealTimeMarketDataReturn,
  WebSocketStatus
} from '@/types/marketData';
import { fetchInitialMarketData } from '@/services/marketDataService';
import { createMarketDataWebSocket, parseWebSocketMessage } from '@/utils/websocketUtils';

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
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
  
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
      const quotesData = await fetchInitialMarketData(symbols);
      setQuotes(quotesData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch market data'));
    } finally {
      setIsLoading(false);
    }
  }, [symbols, enabled]);
  
  useEffect(() => {
    if (!enabled || !symbols.length) return;
    
    fetchInitialData();
    
    const connectWebSocket = () => {
      setWsStatus('connecting');
      
      const ws = createMarketDataWebSocket(
        symbolsRef.current,
        // onOpen
        () => {
          setWsStatus('connected');
          
          ws.send(JSON.stringify({
            action: "subscribe",
            symbols: symbolsRef.current
          }));
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        },
        // onMessage
        (event) => {
          parseWebSocketMessage(
            event, 
            onQuoteUpdate, 
            onTradeUpdate, 
            setQuotes, 
            setTrades
          );
        },
        // onError
        (event) => {
          console.error('WebSocket error:', event);
          setWsStatus('error');
          toast.error('WebSocket connection error');
        },
        // onClose
        (event) => {
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
        }
      );
      
      wsRef.current = ws;
      return ws;
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
