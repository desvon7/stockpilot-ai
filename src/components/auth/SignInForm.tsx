
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, EyeOff, Eye, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading: authLoading, signIn, devModeSignIn } = useAuth();
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDev = import.meta.env.DEV;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const result = await signIn(signinEmail, signinPassword);
      
      if (result?.error) {
        throw result.error;
      }
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = authLoading || isSubmitting;

  return (
    <form onSubmit={handleSignIn} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="signin-email" className="block text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail size={18} className="text-gray-400" />
          </div>
          <Input
            id="signin-email"
            type="email"
            value={signinEmail}
            onChange={(e) => setSigninEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="bg-[#1B203A] border-[#2A3052] pl-10 pr-4 py-2 w-full rounded-md"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="signin-password" className="block text-sm font-medium">
            Password
          </label>
          <Link to="/reset-password" className="text-sm text-green-500 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <Input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            value={signinPassword}
            onChange={(e) => setSigninPassword(e.target.value)}
            placeholder="Your password"
            required
            className="bg-[#1B203A] border-[#2A3052] pl-10 pr-10 py-2 w-full rounded-md"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-400" />
            ) : (
              <Eye size={18} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      <button 
        type="submit"
        disabled={isLoading}
        className="bg-green-500 text-white hover:bg-green-600 w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <>
            Log In
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {isDev && (
        <div className="pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={devModeSignIn}
            className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
            disabled={isLoading}
          >
            Development Mode: Skip Authentication
          </Button>
        </div>
      )}
    </form>
  );
};

export default SignInForm;
