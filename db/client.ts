
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// For server environments (edge functions, Node.js)
export const createDrizzleClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const client = postgres(process.env.DATABASE_URL);
  return drizzle(client, { schema });
};
