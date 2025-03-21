
import { createClient, Provider } from '@supabase/supabase-js';
import { supabase as integratedSupabase } from '@/integrations/supabase/client';

// Use the integrated Supabase client if available, otherwise use the fallback
export const supabase = integratedSupabase;

// Auth helper functions
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  });
  
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};

export const signInWithProvider = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/home`
    }
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Add a debug function to simulate a logged-in user for development
export const simulateLoggedInUser = async () => {
  if (import.meta.env.DEV) {
    // Create a mock user with the required properties that match Supabase User type
    const mockUser = {
      id: 'mock-user-id',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {
        full_name: 'Test User'
      },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };
    
    // Create a mock session with necessary properties
    const mockSession = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
      user: mockUser,
      expires_at: Math.floor(Date.now() / 1000) + 3600
    };
    
    // Store mock session in localStorage to simulate a persisted session
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: mockSession
    }));
    
    console.log('Simulated logged-in user:', mockUser);
    return true;
  }
  return false;
};
