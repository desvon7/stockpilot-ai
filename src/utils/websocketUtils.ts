
import { Quote, Trade } from '@/types/marketData';

export const createMarketDataWebSocket = (
  symbols: string[],
  onOpen: () => void,
  onMessage: (event: MessageEvent) => void,
  onError: (event: Event) => void,
  onClose: (event: CloseEvent) => void
): WebSocket => {
  const baseURL = import.meta.env.VITE_ALPACA_WS_URL || 'wss://stream.data.alpaca.markets/v2/iex';
  
  const ws = new WebSocket(baseURL);
  
  ws.onopen = onOpen;
  ws.onmessage = onMessage;
  ws.onerror = onError;
  ws.onclose = onClose;
  
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
    }
    
    if (data.T === 'subscription') {
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
    
    // Handle error messages
    if (data.T === 'error') {
      console.error('WebSocket error:', data.msg);
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
