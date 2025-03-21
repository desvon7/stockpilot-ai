
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", _event, session ? "User logged in" : "No session");
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const getInitialSession = async () => {
        try {
          console.log("Getting initial session");
          const { data } = await supabase.auth.getSession();
          console.log("Initial session:", data.session ? "Found session" : "No session found");
          setSession(data.session);
          setUser(data.session?.user ?? null);
        } catch (error) {
          console.error('Error getting session:', error);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  return { session, user, loading, setLoading };
};
