
import { useState, useEffect, useRef } from 'react';
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
}

interface UseRealTimeMarketDataProps {
  symbols: string[];
  enabled?: boolean;
}

interface UseRealTimeMarketDataReturn {
  quotes: Record<string, Quote>;
  isLoading: boolean;
  error: Error | null;
  wsStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  refresh: () => Promise<void>;
}

export const useRealTimeMarketData = ({ 
  symbols, 
  enabled = true 
}: UseRealTimeMarketDataProps): UseRealTimeMarketDataReturn => {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const symbolsRef = useRef<string[]>(symbols);
  
  // Update symbolsRef when symbols prop changes
  useEffect(() => {
    symbolsRef.current = symbols;
    
    // If we have an active connection, update subscriptions
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      updateSubscriptions();
    }
  }, [symbols]);
  
  // Function to update WebSocket subscriptions
  const updateSubscriptions = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    wsRef.current.send(JSON.stringify({
      action: "subscribe",
      symbols: symbolsRef.current
    }));
  };

  // Initial data fetch
  const fetchInitialData = async () => {
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
  };
  
  // Establish WebSocket connection
  useEffect(() => {
    if (!enabled || !symbols.length) return;
    
    // First fetch initial data
    fetchInitialData();
    
    // Then establish WebSocket connection
    const connectWebSocket = () => {
      try {
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/stock-market-websocket`;
        
        setWsStatus('connecting');
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setWsStatus('connected');
          
          // Subscribe to symbols
          ws.send(JSON.stringify({
            action: "subscribe",
            symbols: symbolsRef.current
          }));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle different message types
            if (Array.isArray(data)) {
              // Process quote updates
              data.forEach(item => {
                if (item.T === 'q') { // Quote update
                  const quoteUpdate: Quote = {
                    symbol: item.S,
                    price: (item.ap || item.bp) || 0,
                    bid: item.bp || 0,
                    ask: item.ap || 0,
                    bidSize: item.bs,
                    askSize: item.as,
                    timestamp: item.t,
                  };
                  
                  setQuotes(prev => ({
                    ...prev,
                    [item.S]: {
                      ...prev[item.S],
                      ...quoteUpdate
                    }
                  }));
                }
              });
            } else if (data.error) {
              console.error('WebSocket error:', data.error);
              toast.error(`WebSocket error: ${data.error}`);
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
        
        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setWsStatus('disconnected');
          
          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (enabled) {
              connectWebSocket();
            }
          }, 5000);
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
    
    // Cleanup
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [enabled]);
  
  // Function to manually refresh data
  const refresh = async () => {
    await fetchInitialData();
    toast.success('Market data refreshed');
  };
  
  return {
    quotes,
    isLoading,
    error,
    wsStatus,
    refresh
  };
};

export default useRealTimeMarketData;
