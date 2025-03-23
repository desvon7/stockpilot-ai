
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { createNeonClient } from './neon-adapter';

// For server environments (Node.js)
export const createDrizzleClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  try {
    // If using Neon database (URL starts with postgres:// or postgresql://)
    if (process.env.DATABASE_URL.startsWith('postgres://') || 
        process.env.DATABASE_URL.startsWith('postgresql://')) {
      console.log('Creating Postgres client with postgres-js driver');
      const client = postgres(process.env.DATABASE_URL, {
        max: 10, // Maximum number of connections
        idle_timeout: 20, // Idle connection timeout in seconds
        connect_timeout: 10 // Connection timeout in seconds
      });
      return drizzle(client, { 
        schema,
        logger: process.env.NODE_ENV === 'development'
      });
    }
    
    // For serverless environments, use the Neon adapter
    console.log('Creating Neon serverless client');
    return createNeonClient();
  } catch (error) {
    console.error('Error creating database client:', error);
    throw new Error(`Failed to create database client: ${error.message}`);
  }
};

// Export a convenience function for getting a client instance
export const getDbClient = () => {
  const client = createDrizzleClient();
  return client;
};
