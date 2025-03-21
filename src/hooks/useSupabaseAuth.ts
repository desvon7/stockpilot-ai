
import { useNavigate } from 'react-router-dom';
import { User, Provider, Session } from '@supabase/supabase-js';
import { supabase, simulateLoggedInUser } from '@/lib/supabase';
import { toast } from 'sonner';

export const useSupabaseAuth = () => {
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting to sign up user:", email);
      const { data, error } = await supabase.auth.signUp({
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
        return { error };
      }
      
      console.log("Sign up successful, verification email sent");
      toast.success('Verification email sent! Please check your inbox.');
      navigate('/auth');
      return { data };
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'An error occurred during sign up');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error details:", error);
        return { error };
      }
      
      console.log("Sign in successful");
      navigate('/home');
      toast.success('Signed in successfully!');
      return { data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Invalid login credentials');
      return { error };
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      if (error) {
        return { error };
      }
      
      return { data };
    } catch (error: any) {
      toast.error(error.message || 'Error signing in with provider');
      console.error('OAuth error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error };
      }
      
      navigate('/');
      toast.success('Signed out successfully');
      return {};
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Error sending password reset instructions');
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const devModeSignIn = async () => {
    const DEV_MODE = import.meta.env.DEV && true;
    
    if (DEV_MODE) {
      try {
        const success = await simulateLoggedInUser();
        
        if (success) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            navigate('/home');
            toast.success('Signed in as Development User');
            return { data };
          }
        }
      } catch (error) {
        console.error('Error with dev mode sign in:', error);
        toast.error('Failed to initialize dev mode');
        return { error };
      }
      return { data: null };
    }
    toast.error('Development mode is disabled');
    return { error: new Error('Development mode is disabled') };
  };

  return { 
    signUp, 
    signIn, 
    signInWithProvider, 
    signOut, 
    resetPassword, 
    devModeSignIn 
  };
};
