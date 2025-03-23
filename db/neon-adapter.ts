
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema';

// For serverless environments (edge functions, serverless functions)
export const createNeonClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  // Create SQL executor with connection pooling for better performance
  const sql = neon(process.env.DATABASE_URL, { 
    poolSize: 5, // Adjust based on your workload
    fullResults: true // Return full result objects
  });
  
  // Create and return Drizzle ORM instance
  return drizzle(sql, { 
    schema,
    logger: process.env.NODE_ENV === 'development'
  });
};
