
import { Quote, Trade } from '@/types/marketData';

export const createMarketDataWebSocket = (
  symbols: string[],
  onOpen: () => void,
  onMessage: (event: MessageEvent) => void,
  onError: (event: Event) => void,
  onClose: (event: CloseEvent) => void
): WebSocket => {
  const wsUrl = import.meta.env.VITE_MARKET_DATA_WS_URL || 'wss://stream.data.alpaca.markets/v2/iex';
  const ws = new WebSocket(wsUrl);
  
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
    
    // Handle authentication response
    if (Array.isArray(data) && data[0] && data[0].T === 'success') {
      console.log('Authentication successful:', data[0].msg);
      return;
    }
    
    // Handle quotes
    if (Array.isArray(data) && data[0] && data[0].T === 'q') {
      data.forEach((quote) => {
        if (quote.T !== 'q') return;
        
        const formattedQuote: Quote = {
          symbol: quote.S,
          price: quote.ap || quote.bp || 0,
          ask: quote.ap || 0,
          bid: quote.bp || 0,
          askSize: quote.as || 0,
          bidSize: quote.bs || 0,
          timestamp: new Date(quote.t).getTime()
        };
        
        if (onQuoteUpdate) {
          onQuoteUpdate(formattedQuote.symbol, formattedQuote);
        }
        
        if (setQuotes) {
          setQuotes(prev => ({
            ...prev,
            [formattedQuote.symbol]: formattedQuote
          }));
        }
      });
    }
    
    // Handle trades
    if (Array.isArray(data) && data[0] && data[0].T === 't') {
      data.forEach((trade) => {
        if (trade.T !== 't') return;
        
        const formattedTrade: Trade = {
          symbol: trade.S,
          price: trade.p,
          size: trade.s,
          timestamp: new Date(trade.t).getTime(),
          exchange: trade.x
        };
        
        if (onTradeUpdate) {
          onTradeUpdate(formattedTrade.symbol, formattedTrade);
        }
        
        if (setTrades) {
          setTrades(prev => ({
            ...prev,
            [formattedTrade.symbol]: formattedTrade
          }));
        }
      });
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
};
