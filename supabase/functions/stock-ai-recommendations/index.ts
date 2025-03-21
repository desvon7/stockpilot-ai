
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { symbol } = await req.json();
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // This is a simplified version that returns mock AI recommendations
    // In a real app, you would connect to an AI service or financial analysis API
    
    const mockRecommendations = [
      {
        symbol: symbol,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        reason: `Based on recent financial performance and market trends, our AI analysis suggests this is a good ${Math.random() > 0.5 ? 'buying' : 'selling'} opportunity.`,
        targetPrice: Math.random() * 100 + 50, // Random price between 50 and 150
      }
    ];
    
    return new Response(
      JSON.stringify({ recommendations: mockRecommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate recommendations' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
