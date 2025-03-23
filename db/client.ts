
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { createNeonClient } from './neon-adapter';

// For server environments (Node.js)
export const createDrizzleClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  // If using Neon database (URL starts with postgres:// or postgresql://)
  if (process.env.DATABASE_URL.startsWith('postgres://') || 
      process.env.DATABASE_URL.startsWith('postgresql://')) {
    const client = postgres(process.env.DATABASE_URL);
    return drizzle(client, { schema });
  }
  
  // For serverless environments, use the Neon adapter
  return createNeonClient();
};
