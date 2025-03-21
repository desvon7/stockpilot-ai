
import React, { createContext, useContext } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{data?: any, error?: any}>;
  signIn: (email: string, password: string) => Promise<{data?: any, error?: any}>;
  signInWithProvider: (provider: Provider) => Promise<{data?: any, error?: any}>;
  signOut: () => Promise<{error?: any}>;
  resetPassword: (email: string) => Promise<void>;
  devModeSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, user, loading, setLoading } = useAuthState();
  const { 
    signUp, 
    signIn, 
    signInWithProvider, 
    signOut, 
    resetPassword, 
    devModeSignIn 
  } = useSupabaseAuth();

  // Create an async wrapper for devModeSignIn that handles loading state
  const handleDevModeSignIn = async () => {
    try {
      setLoading(true);
      await devModeSignIn();
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
      devModeSignIn: handleDevModeSignIn
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
