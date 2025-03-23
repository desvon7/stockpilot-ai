
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide an array of symbols' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create WebSocket connection
    const socket = new WebSocket('wss://ws.finnhub.io?token=' + FINNHUB_API_KEY);
    
    // Connection opened -> Subscribe to symbols
    const socketPromise = new Promise((resolve, reject) => {
      const quotes = {};
      let timeoutId;
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        // Subscribe to symbols
        symbols.forEach(symbol => {
          socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
        });
        
        // Set timeout for WebSocket connection
        timeoutId = setTimeout(() => {
          socket.close();
          console.log('WebSocket connection timed out after 3 seconds');
          resolve({ quotes, status: Object.keys(quotes).length > 0 ? 'connected' : 'timeout' });
        }, 3000);
      };
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'trade') {
          data.data.forEach(trade => {
            const symbol = trade.s;
            quotes[symbol] = {
              price: trade.p,
              timestamp: trade.t,
              volume: trade.v
            };
          });
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        clearTimeout(timeoutId);
        reject(new Error('WebSocket connection error'));
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected');
        clearTimeout(timeoutId);
      };
    });
    
    // Wait for data or timeout
    const result = await socketPromise.catch(error => {
      return { quotes: {}, status: 'error', message: error.message };
    });
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Stock WebSocket error:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred', status: 'error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
