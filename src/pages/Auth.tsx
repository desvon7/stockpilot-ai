
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  EyeOff, 
  Eye, 
  ArrowRight, 
  Check, 
  ChevronRight,
  Apple,
  Smartphone
} from 'lucide-react';
import { Google } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type AuthTab = 'signin' | 'signup';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading, signIn, signUp, signInWithProvider } = useAuth();
  
  // Sign In form state
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  
  // Sign Up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // If already logged in, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/home" replace />;
  }
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(signinEmail, signinPassword);
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      return;
    }
    await signUp(signupEmail, signupPassword, signupName);
  };
  
  const handleProviderSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    await signInWithProvider(provider);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#11131E] text-white">
      <Navbar />
      <main className="flex-grow pt-12 pb-12 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-[#171B2D] rounded-lg p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="flex mb-6">
                  <button
                    onClick={() => setActiveTab('signin')}
                    className={cn(
                      'flex-1 pb-2 text-center font-medium transition-colors border-b-2',
                      activeTab === 'signin'
                        ? 'border-green-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    )}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setActiveTab('signup')}
                    className={cn(
                      'flex-1 pb-2 text-center font-medium transition-colors border-b-2',
                      activeTab === 'signup'
                        ? 'border-green-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    )}
                  >
                    Sign Up
                  </button>
                </div>
                
                {activeTab === 'signin' ? (
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
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="signin-password" className="block text-sm font-medium">
                          Password
                        </label>
                        <Link to="/forgot-password" className="text-sm text-green-500 hover:underline">
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
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
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
                      disabled={loading}
                      className="bg-green-500 text-white hover:bg-green-600 w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {loading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          Log In
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 text-sm text-gray-400 bg-[#171B2D]">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => handleProviderSignIn('google')}
                        className="bg-[#1B203A] hover:bg-[#232845] py-3 rounded-md flex items-center justify-center gap-2 transition-colors border border-[#2A3052]"
                      >
                        <Google className="w-5 h-5" />
                        <span>Continue with Google</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleProviderSignIn('apple')}
                        className="bg-[#1B203A] hover:bg-[#232845] py-3 rounded-md flex items-center justify-center gap-2 transition-colors border border-[#2A3052]"
                      >
                        <Apple className="w-5 h-5" />
                        <span>Continue with Apple</span>
                      </button>
                    </div>
                  </form>
                ) : (
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
                          className="bg-[#1B203A] border-[#2A3052] pl-10 pr-10 py-2 w-full rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Password must be at least 8 characters and include a number and a special character.
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
                      disabled={loading || !agreeToTerms}
                      className="bg-green-500 text-white hover:bg-green-600 w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {loading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          Create Account
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 text-sm text-gray-400 bg-[#171B2D]">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => handleProviderSignIn('google')}
                        className="bg-[#1B203A] hover:bg-[#232845] py-3 rounded-md flex items-center justify-center gap-2 transition-colors border border-[#2A3052]"
                      >
                        <Google className="w-5 h-5" />
                        <span>Continue with Google</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleProviderSignIn('apple')}
                        className="bg-[#1B203A] hover:bg-[#232845] py-3 rounded-md flex items-center justify-center gap-2 transition-colors border border-[#2A3052]"
                      >
                        <Apple className="w-5 h-5" />
                        <span>Continue with Apple</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
