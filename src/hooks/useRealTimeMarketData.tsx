
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
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;
  
  // Store the API keys from environment variables or secrets
  const apiKey = import.meta.env.VITE_ALPACA_API_KEY;
  const apiSecret = import.meta.env.VITE_ALPACA_API_SECRET;
  
  useEffect(() => {
    symbolsRef.current = symbols;
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      updateSubscriptions();
    }
  }, [symbols]);
  
  const updateSubscriptions = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    // Subscribe to the symbols
    wsRef.current.send(JSON.stringify({
      action: "subscribe",
      trades: symbolsRef.current,
      quotes: symbolsRef.current
    }));
  }, []);

  const authenticateWebSocket = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    // Authenticate with Alpaca API
    wsRef.current.send(JSON.stringify({
      action: "auth",
      key: apiKey,
      secret: apiSecret
    }));
  }, [apiKey, apiSecret]);

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
          authenticateWebSocket();
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
          reconnectAttempts.current = 0;
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
          
          // Attempt to reconnect if not a clean close
          if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            const delay = Math.min(1000 * reconnectAttempts.current, 10000);
            
            toast.info(`Reconnecting to market data... (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = window.setTimeout(() => {
              connectWebSocket();
            }, delay);
          } else if (reconnectAttempts.current >= maxReconnectAttempts) {
            toast.error('Failed to connect to market data after multiple attempts');
            setError(new Error('Maximum reconnection attempts reached'));
          }
        }
      );
      
      wsRef.current = ws;
    };
    
    connectWebSocket();
    
    // Cleanup function to close WebSocket on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [enabled, symbols, authenticateWebSocket, onQuoteUpdate, onTradeUpdate, fetchInitialData]);
  
  // Manual refresh function
  const refresh = useCallback(async () => {
    try {
      // Fetch initial data again
      await fetchInitialData();
      
      // Reconnect WebSocket if needed
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        if (wsRef.current) {
          wsRef.current.close();
        }
        
        setWsStatus('connecting');
        const ws = createMarketDataWebSocket(
          symbolsRef.current,
          () => {
            setWsStatus('connected');
            authenticateWebSocket();
          },
          (event) => {
            parseWebSocketMessage(event, onQuoteUpdate, onTradeUpdate, setQuotes, setTrades);
          },
          (event) => {
            console.error('WebSocket error during refresh:', event);
            setWsStatus('error');
          },
          (event) => {
            console.log('WebSocket disconnected during refresh:', event.code, event.reason);
            setWsStatus('disconnected');
          }
        );
        
        wsRef.current = ws;
      } else {
        // If already connected, just update subscriptions
        updateSubscriptions();
      }
      
      toast.success('Market data refreshed');
    } catch (err) {
      console.error('Error refreshing market data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh market data'));
      toast.error('Failed to refresh market data');
    }
    
    return Promise.resolve();
  }, [fetchInitialData, authenticateWebSocket, onQuoteUpdate, onTradeUpdate, updateSubscriptions]);
  
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
