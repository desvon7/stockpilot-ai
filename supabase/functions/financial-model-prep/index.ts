
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FMP_API_KEY = Deno.env.get('FINANCIAL_MODEL_PREP_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, symbol, period, limit } = await req.json();
    
    if (!FMP_API_KEY) {
      throw new Error('Financial Model Prep API key is not configured');
    }

    console.log(`Fetching Financial Model Prep data - endpoint: ${endpoint}, symbol: ${symbol}`);
    
    let url = '';
    
    // Build URL based on the requested endpoint
    switch (endpoint) {
      case 'company_profile':
        url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`;
        break;
      case 'income_statement':
        url = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=${period || 'annual'}&limit=${limit || 5}&apikey=${FMP_API_KEY}`;
        break;
      case 'balance_sheet':
        url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?period=${period || 'annual'}&limit=${limit || 5}&apikey=${FMP_API_KEY}`;
        break;
      case 'cash_flow':
        url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=${period || 'annual'}&limit=${limit || 5}&apikey=${FMP_API_KEY}`;
        break;
      case 'key_metrics':
        url = `https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?period=${period || 'annual'}&limit=${limit || 5}&apikey=${FMP_API_KEY}`;
        break;
      case 'ratios':
        url = `https://financialmodelingprep.com/api/v3/ratios/${symbol}?period=${period || 'annual'}&limit=${limit || 5}&apikey=${FMP_API_KEY}`;
        break;
      case 'earnings':
        url = `https://financialmodelingprep.com/api/v3/earnings/${symbol}?limit=${limit || 10}&apikey=${FMP_API_KEY}`;
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    // Add a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Financial Model Prep API error (${response.status}): ${errorText}`);
        throw new Error(`Financial Model Prep API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Financial Model Prep API request timed out');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error in financial-model-prep function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while fetching financial data' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
