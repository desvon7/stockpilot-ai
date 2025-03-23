
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALPACA_API_KEY = Deno.env.get('ALPACA_API_KEY');
const ALPACA_API_SECRET = Deno.env.get('ALPACA_API_SECRET');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if it's a WebSocket request
  const upgradeHeader = req.headers.get("upgrade") || "";
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    // Upgrade the connection to a WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Create a connection to Alpaca WebSocket API
    const alpacaSocket = new WebSocket("wss://stream.data.alpaca.markets/v2/iex");
    
    // Handle the WebSocket connection with the client
    socket.onopen = () => {
      console.log("Client connected");
      
      // When Alpaca WebSocket is open, authenticate
      alpacaSocket.onopen = () => {
        console.log("Connected to Alpaca WebSocket");
        alpacaSocket.send(JSON.stringify({
          action: "auth",
          key: ALPACA_API_KEY,
          secret: ALPACA_API_SECRET
        }));
      };
      
      // Handle messages from Alpaca and forward to client
      alpacaSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Check if it's an authentication response
        if (data[0]?.T === "success" && data[0]?.msg === "authenticated") {
          console.log("Authenticated with Alpaca WebSocket");
          socket.send(JSON.stringify({ type: "status", status: "authenticated" }));
        } 
        // Forward quote and trade data to the client
        else if (data[0]?.T === "q" || data[0]?.T === "t") {
          socket.send(event.data);
        }
      };
      
      // Handle Alpaca socket errors
      alpacaSocket.onerror = (e) => {
        console.error("Alpaca WebSocket error:", e);
        socket.send(JSON.stringify({ type: "error", message: "Data provider connection error" }));
      };
      
      // Handle Alpaca socket close
      alpacaSocket.onclose = () => {
        console.log("Alpaca WebSocket closed");
        socket.send(JSON.stringify({ type: "status", status: "disconnected", message: "Data provider connection closed" }));
      };
    };
    
    // Handle messages from the client
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle subscription requests
        if (message.action === "subscribe" && Array.isArray(message.symbols)) {
          console.log(`Subscribing to symbols: ${message.symbols.join(', ')}`);
          
          // Subscribe to both quotes and trades for the symbols
          alpacaSocket.send(JSON.stringify({
            action: "subscribe",
            quotes: message.symbols,
            trades: message.symbols
          }));
          
          // Acknowledge the subscription
          socket.send(JSON.stringify({
            type: "subscription",
            status: "subscribed",
            symbols: message.symbols
          }));
        }
        // Handle unsubscribe requests
        else if (message.action === "unsubscribe" && Array.isArray(message.symbols)) {
          console.log(`Unsubscribing from symbols: ${message.symbols.join(', ')}`);
          
          alpacaSocket.send(JSON.stringify({
            action: "unsubscribe",
            quotes: message.symbols,
            trades: message.symbols
          }));
          
          socket.send(JSON.stringify({
            type: "subscription",
            status: "unsubscribed",
            symbols: message.symbols
          }));
        }
      } catch (error) {
        console.error("Error handling client message:", error);
        socket.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    };
    
    // Handle client connection close
    socket.onclose = () => {
      console.log("Client disconnected");
      if (alpacaSocket.readyState === WebSocket.OPEN) {
        alpacaSocket.close();
      }
    };
    
    // Handle client connection error
    socket.onerror = (e) => {
      console.error("Client connection error:", e);
    };
    
    return response;
  } catch (error) {
    console.error("Error handling WebSocket connection:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
