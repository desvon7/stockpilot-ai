
import { Quote, Trade, WebSocketStatus } from '@/types/marketData';

// Create a WebSocket connection to get real-time market data
export const createMarketDataWebSocket = (
  symbols: string[],
  onOpen: () => void,
  onMessage: (event: MessageEvent) => void,
  onError: (event: Event) => void,
  onClose: (event: CloseEvent) => void
): WebSocket => {
  // Using Alpaca's websocket API
  const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');
  
  ws.onopen = () => {
    console.log('WebSocket connected');
    onOpen();
  };
  
  ws.onmessage = onMessage;
  ws.onerror = onError;
  ws.onclose = onClose;
  
  return ws;
};

// Parse messages from the WebSocket
export const parseWebSocketMessage = (
  event: MessageEvent,
  onQuoteUpdate?: (symbol: string, quote: Quote) => void,
  onTradeUpdate?: (symbol: string, trade: Trade) => void,
  setQuotes?: React.Dispatch<React.SetStateAction<Record<string, Quote>>>,
  setTrades?: React.Dispatch<React.SetStateAction<Record<string, Trade>>>
) => {
  try {
    const data = JSON.parse(event.data);
    
    // Handle authentication response
    if (data.type === 'authorization') {
      if (data.status === 'authorized') {
        console.log('WebSocket authenticated successfully');
      } else {
        console.error('WebSocket authentication failed', data);
      }
      return;
    }
    
    // Handle subscription response
    if (data.type === 'subscription') {
      console.log('Subscription update:', data);
      return;
    }
    
    // Handle quotes
    if (data.type === 'q' && data.quotes) {
      Object.entries(data.quotes).forEach(([symbol, quoteData]: [string, any]) => {
        const quote: Quote = {
          symbol,
          price: quoteData.ap || quoteData.bp || 0,
          bid: quoteData.bp || 0,
          ask: quoteData.ap || 0,
          bidSize: quoteData.bs || 0,
          askSize: quoteData.as || 0,
          timestamp: quoteData.t || Date.now(),
          previousClose: quoteData.c || 0,
          change: quoteData.ap ? quoteData.ap - quoteData.c : 0,
          changePercent: quoteData.ap && quoteData.c ? ((quoteData.ap - quoteData.c) / quoteData.c) * 100 : 0
        };
        
        // Update quotes state
        if (setQuotes) {
          setQuotes(prev => ({
            ...prev,
            [symbol]: quote
          }));
        }
        
        // Callback for quote update
        if (onQuoteUpdate) {
          onQuoteUpdate(symbol, quote);
        }
      });
    }
    
    // Handle trades
    if (data.type === 't' && data.trades) {
      Object.entries(data.trades).forEach(([symbol, tradeData]: [string, any]) => {
        const trade: Trade = {
          symbol,
          price: tradeData.p || 0,
          size: tradeData.s || 0,
          timestamp: tradeData.t || Date.now(),
          exchange: tradeData.x || ''
        };
        
        // Update trades state
        if (setTrades) {
          setTrades(prev => ({
            ...prev,
            [symbol]: trade
          }));
        }
        
        // Callback for trade update
        if (onTradeUpdate) {
          onTradeUpdate(symbol, trade);
        }
      });
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error, event.data);
  }
};
