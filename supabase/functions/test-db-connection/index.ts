
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { neon } from 'npm:@neondatabase/serverless';
import { drizzle } from 'npm:drizzle-orm/neon-http';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get database URL from environment variables
    const databaseUrl = Deno.env.get('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Create a Neon client
    const sql = neon(databaseUrl);
    const db = drizzle(sql);
    
    // Test the connection
    const result = await sql`SELECT NOW() as current_time`;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Database connection successful', 
        timestamp: result[0].current_time 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
