
import { Quote, Trade } from '@/types/marketData';
import { toast } from 'sonner';

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const createMarketDataWebSocket = (
  symbols: string[],
  onOpen: () => void,
  onMessage: (event: MessageEvent) => void,
  onError: (event: Event) => void,
  onClose: (event: CloseEvent) => void
): WebSocket => {
  // Check if we're in development environment
  const isDev = import.meta.env.DEV;
  
  // Use mock websocket URL for development if API keys are not available
  const baseURL = isDev ? 
    'wss://demo.trading.com/ws' : // This is just a placeholder, it won't connect
    (import.meta.env.VITE_ALPACA_WS_URL || 'wss://stream.data.alpaca.markets/v2/iex');
  
  let ws: WebSocket;
  
  try {
    ws = new WebSocket(baseURL);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      
      // If we're in development, skip authentication
      if (isDev) {
        console.log('Development mode: Skipping authentication');
        onOpen();
        return;
      }
      
      // Send authentication message
      const authMsg = {
        action: 'auth',
        key: import.meta.env.VITE_ALPACA_API_KEY,
        secret: import.meta.env.VITE_ALPACA_API_SECRET
      };
      
      if (!authMsg.key || !authMsg.secret) {
        console.warn('API keys missing, using mock data');
        // Simulate successful auth for development
        setTimeout(() => {
          const mockAuthEvent = new MessageEvent('message', {
            data: JSON.stringify({ T: 'success', msg: 'authenticated' })
          });
          onMessage(mockAuthEvent);
          onOpen();
        }, 500);
      } else {
        ws.send(JSON.stringify(authMsg));
        // Execute the provided onOpen callback
        onOpen();
      }
    };
    
    ws.onmessage = onMessage;
    
    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      onError(event);
    };
    
    ws.onclose = (event) => {
      console.info('WebSocket disconnected:', event.code);
      
      // Attempt to reconnect if not closing cleanly
      if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        const delay = Math.min(1000 * reconnectAttempts, 5000); // Exponential backoff
        
        toast.info(`Reconnecting to market data... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`, {
          id: 'market-data-reconnection',
          duration: delay + 1000,
        });
        
        setTimeout(() => {
          // Try to create a new connection
          createMarketDataWebSocket(symbols, onOpen, onMessage, onError, onClose);
        }, delay);
      }
      
      onClose(event);
    };
  } catch (error) {
    console.error('Error creating WebSocket:', error);
    // Create a mock WebSocket for development
    ws = {} as WebSocket;
    
    // Simulate WebSocket events with mock data
    setTimeout(() => {
      onOpen();
      
      // Send mock data periodically
      const mockInterval = setInterval(() => {
        symbols.forEach(symbol => {
          const mockData = {
            T: 'q',
            S: symbol,
            bp: Math.random() * 1000 + 50,
            ap: Math.random() * 1000 + 51,
            bs: Math.floor(Math.random() * 100),
            as: Math.floor(Math.random() * 100),
            t: Date.now()
          };
          
          const mockEvent = new MessageEvent('message', { 
            data: JSON.stringify(mockData)
          });
          
          onMessage(mockEvent);
        });
      }, 5000);
      
      // Add a cleanup method
      ws.close = () => {
        clearInterval(mockInterval);
      };
    }, 1000);
  }
  
  return ws;
};

export const parseWebSocketMessage = (
  event: MessageEvent,
  onQuoteUpdate?: (symbol: string, quote: Quote) => void,
  onTradeUpdate?: (symbol: string, trade: Trade) => void,
  setQuotes?: React.Dispatch<React.SetStateAction<Record<string, Quote>>>,
  setTrades?: React.Dispatch<React.SetStateAction<Record<string, Trade>>>
) => {
  try {
    const data = JSON.parse(event.data);
    
    // Handle different message types
    if (data.T === 'success' && data.msg === 'authenticated') {
      console.log('WebSocket authenticated successfully');
      return;
    } else if (data.T === 'error') {
      console.error('WebSocket error:', data.msg);
      toast.error(`Market data error: ${data.msg}`);
      return;
    } else if (data.T === 'subscription') {
      console.log('Subscription successful:', data.trades, data.quotes);
      return;
    }
    
    // Handle quotes
    if (data.T === 'q') {
      const quote: Quote = {
        symbol: data.S,
        price: (data.ap || data.bp || 0),
        bid: data.bp || 0,
        ask: data.ap || 0,
        bidSize: data.bs || 0,
        askSize: data.as || 0,
        timestamp: data.t,
      };
      
      // If previous day close is available, calculate change values
      if (data.c) {
        const previousClose = data.c;
        quote.previousClose = previousClose;
        quote.change = quote.price - previousClose;
        quote.changePercent = (quote.change / previousClose) * 100;
      }
      
      if (onQuoteUpdate) {
        onQuoteUpdate(quote.symbol, quote);
      }
      
      if (setQuotes) {
        setQuotes(prev => ({
          ...prev,
          [quote.symbol]: quote
        }));
      }
    }
    
    // Handle trades
    if (data.T === 't') {
      const trade: Trade = {
        symbol: data.S,
        price: data.p,
        size: data.s,
        timestamp: data.t,
        exchange: data.x
      };
      
      if (onTradeUpdate) {
        onTradeUpdate(trade.symbol, trade);
      }
      
      if (setTrades) {
        setTrades(prev => ({
          ...prev,
          [trade.symbol]: trade
        }));
      }
    }
    
    // Handle arrays of messages (batch updates)
    if (Array.isArray(data)) {
      data.forEach(msg => {
        // Create a new MessageEvent-like object
        const msgEvent = {
          data: JSON.stringify(msg)
        } as MessageEvent;
        
        // Recursively process each message
        parseWebSocketMessage(
          msgEvent,
          onQuoteUpdate,
          onTradeUpdate,
          setQuotes,
          setTrades
        );
      });
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error, event.data);
  }
};

// Subscribe to market data for specific symbols
export const subscribeToMarketData = (ws: WebSocket, symbols: string[]) => {
  if (!symbols || symbols.length === 0) {
    console.warn('No symbols provided for subscription');
    return;
  }
  
  if (ws.readyState === WebSocket.OPEN) {
    const subscribeMsg = {
      action: 'subscribe',
      trades: symbols,
      quotes: symbols,
      bars: symbols
    };
    
    console.log('Subscribing to market data for:', symbols);
    try {
      ws.send(JSON.stringify(subscribeMsg));
    } catch (error) {
      console.error('Error sending subscription message:', error);
      
      // In development, simulate a successful subscription
      if (import.meta.env.DEV) {
        console.log('Development mode: Simulating successful subscription');
        setTimeout(() => {
          // Create mock subscription success message
          const mockEvent = new MessageEvent('message', {
            data: JSON.stringify({ T: 'subscription', trades: symbols, quotes: symbols })
          });
          // Dispatch it to any handlers
          ws.onmessage && ws.onmessage(mockEvent);
        }, 500);
      }
    }
  } else {
    console.warn('WebSocket not open, unable to subscribe');
    setTimeout(() => subscribeToMarketData(ws, symbols), 1000);
  }
};
