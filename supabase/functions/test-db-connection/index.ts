
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    console.log('Testing database connection...');
    
    // Get database URL from environment variables
    const databaseUrl = Deno.env.get('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Create a Neon client with connection parameters
    const sql = neon(databaseUrl, {
      fullResults: true
    });
    
    const db = drizzle(sql);
    
    // Test the connection with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      // Fix: Remove the trailing semicolon after controller.signal
      const result = await sql`SELECT NOW() as current_time, current_database() as database_name`,
                            { signal: controller.signal };
      clearTimeout(timeoutId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Database connection successful', 
          timestamp: result[0].current_time,
          database: result[0].database_name
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (timeoutError) {
      clearTimeout(timeoutId);
      throw new Error(`Database query timed out: ${timeoutError.message}`);
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    
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
