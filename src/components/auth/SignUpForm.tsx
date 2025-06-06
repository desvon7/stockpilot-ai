import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, EyeOff, Eye, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading: authLoading, signUp } = useAuth();
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const result = await signUp(signupEmail, signupPassword, signupName);
      
      if (result?.error) {
        throw result.error;
      }
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = authLoading || isSubmitting;

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="signup-name" className="block text-sm font-medium">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User size={18} className="text-gray-400" />
          </div>
          <Input
            id="signup-name"
            type="text"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            placeholder="Your full name"
            required
            className="bg-[#1B203A] border-[#2A3052] pl-10 pr-4 py-2 w-full rounded-md"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signup-email" className="block text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail size={18} className="text-gray-400" />
          </div>
          <Input
            id="signup-email"
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="bg-[#1B203A] border-[#2A3052] pl-10 pr-4 py-2 w-full rounded-md"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="signup-password" className="block text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className="text-gray-400" />
          </div>
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Create a password"
            required
            minLength={6}
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
        <p className="text-xs text-gray-400 mt-1">
          Password must be at least 6 characters.
        </p>
      </div>
      
      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          required
          className="w-4 h-4 text-green-500 rounded border-[#2A3052] bg-[#1B203A] focus:ring-green-500"
          disabled={isLoading}
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
          I agree to the{' '}
          <Link to="/terms" className="text-green-500 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-green-500 hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      
      <button 
        type="submit"
        disabled={isLoading || !agreeToTerms}
        className="bg-green-500 text-white hover:bg-green-600 w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <>
            Create Account
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
