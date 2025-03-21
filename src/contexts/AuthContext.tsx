import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase, simulateLoggedInUser } from '@/lib/supabase';
import { toast } from 'sonner';

const DEV_MODE = import.meta.env.DEV && true; // Changed to true to enable dev mode

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  devModeSignIn: () => Promise<void>; // New function for dev mode
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const devModeSignIn = async () => {
    if (DEV_MODE) {
      setLoading(true);
      const success = await simulateLoggedInUser();
      
      if (success) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          navigate('/home');
          toast.success('Signed in as Development User');
        }
      }
      
      setLoading(false);
      return;
    }
    toast.error('Development mode is disabled');
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign up user:", email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        console.error("Sign up error details:", error);
        throw error;
      }
      
      console.log("Sign up successful, verification email sent");
      toast.success('Verification email sent! Please check your inbox.');
      navigate('/auth');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'An error occurred during sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Attempting to sign in user:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error details:", error);
        throw error;
      }
      
      console.log("Sign in successful");
      navigate('/home');
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Invalid login credentials');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast.error(error.message || 'Error signing in with provider');
      console.error('OAuth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Error sending password reset instructions');
      console.error('Password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signUp, 
      signIn, 
      signInWithProvider, 
      signOut,
      resetPassword,
      devModeSignIn
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
