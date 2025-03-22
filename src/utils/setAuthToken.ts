
import { supabase } from '@/lib/supabase';

const setAuthToken = (token: string | null) => {
  if (token) {
    // Set auth token to Supabase client
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
    // Store token in localStorage (Supabase already does this, but we'll do it explicitly)
    localStorage.setItem('token', token);
  } else {
    // Remove token from localStorage
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
