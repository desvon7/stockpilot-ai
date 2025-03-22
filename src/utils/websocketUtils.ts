
import { toast } from 'sonner';

/**
 * Creates a WebSocket connection for real-time market data
 */
export const createMarketDataWebSocket = (
  symbols: string[],
  onOpen: () => void,
  onMessage: (event: MessageEvent) => void,
  onError: (event: Event) => void,
  onClose: (event: CloseEvent) => void
): WebSocket | null => {
  try {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl = '';
    
    if (import.meta.env.MODE === 'development') {
      wsUrl = `${wsProtocol}//${window.location.hostname}:54321/functions/v1/stock-market-websocket`;
    } else {
      wsUrl = `wss://fansbktmwnskvolllfhk.supabase.co/functions/v1/stock-market-websocket`;
    }
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      onOpen();
      toast.success('Connected to real-time market data');
    };
    
    ws.onmessage = onMessage;
    ws.onerror = onError;
    ws.onclose = onClose;
    
    return ws;
  } catch (err) {
    console.error('Error establishing WebSocket connection:', err);
    toast.error('Failed to establish WebSocket connection');
    return null;
  }
};

/**
 * Parse WebSocket message data
 */
export const parseWebSocketMessage = (
  event: MessageEvent,
  onQuoteUpdate?: (symbol: string, quote: any) => void,
  onTradeUpdate?: (symbol: string, trade: any) => void,
  updateQuotes?: (updateFn: (prev: any) => any) => void,
  updateTrades?: (updateFn: (prev: any) => any) => void
) => {
  try {
    const data = JSON.parse(event.data);
    
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.T === 'q') {
          handleQuoteMessage(item, onQuoteUpdate, updateQuotes);
        } else if (item.T === 't') {
          handleTradeMessage(item, onTradeUpdate, updateTrades, updateQuotes);
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

/**
 * Handle a quote message from WebSocket
 */
const handleQuoteMessage = (
  item: any,
  onQuoteUpdate?: (symbol: string, quote: any) => void,
  updateQuotes?: (updateFn: (prev: any) => any) => void
) => {
  if (!updateQuotes) return;
  
  const quoteUpdate = {
    symbol: item.S,
    price: (item.ap || item.bp) || 0,
    bid: item.bp || 0,
    ask: item.ap || 0,
    bidSize: item.bs,
    askSize: item.as,
    timestamp: item.t,
  };
  
  updateQuotes(prev => {
    const prevQuote = prev[item.S] || {} as any;
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
};

/**
 * Handle a trade message from WebSocket
 */
const handleTradeMessage = (
  item: any,
  onTradeUpdate?: (symbol: string, trade: any) => void,
  updateTrades?: (updateFn: (prev: any) => any) => void,
  updateQuotes?: (updateFn: (prev: any) => any) => void
) => {
  if (!updateTrades || !updateQuotes) return;
  
  const tradeUpdate = {
    symbol: item.S,
    price: item.p || 0,
    size: item.s || 0,
    timestamp: item.t,
    exchange: item.x || '',
  };
  
  updateTrades(prev => {
    const newTrades = {
      ...prev,
      [item.S]: tradeUpdate
    };
    
    if (onTradeUpdate) {
      onTradeUpdate(item.S, tradeUpdate);
    }
    
    return newTrades;
  });
  
  updateQuotes(prev => {
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
};
