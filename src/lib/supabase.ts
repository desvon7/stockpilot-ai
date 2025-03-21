
import { createClient, Provider } from '@supabase/supabase-js';

// Use default values if environment variables are not available
// These will be replaced with actual values in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Warn about missing credentials only in development
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Missing Supabase credentials. Using placeholder values for development.');
  console.warn('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
  console.warn('For testing, you can also use the mock user feature below.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

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
