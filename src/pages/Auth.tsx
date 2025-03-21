
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
  ChevronRight 
} from 'lucide-react';

type AuthTab = 'signin' | 'signup';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
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
    return <Navigate to="/dashboard" replace />;
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
  
  const handleProviderSignIn = async (provider: 'google' | 'facebook' | 'github') => {
    await signInWithProvider(provider);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16 flex items-center justify-center">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="hidden lg:block">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold mb-2">Welcome to StockPilot</h1>
                <p className="text-xl text-muted-foreground">
                  Join the next generation of AI-powered trading platform and take control of your investments.
                </p>
                
                <div className="space-y-4 mt-8">
                  <div className="flex gap-3">
                    <div className="shrink-0 bg-primary/10 text-primary rounded-full p-1 h-fit">
                      <Check size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Commission-Free Trading</h3>
                      <p className="text-muted-foreground">Trade stocks, ETFs, and cryptocurrencies with zero fees.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="shrink-0 bg-primary/10 text-primary rounded-full p-1 h-fit">
                      <Check size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">AI-Powered Insights</h3>
                      <p className="text-muted-foreground">Get personalized investment recommendations based on your goals.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="shrink-0 bg-primary/10 text-primary rounded-full p-1 h-fit">
                      <Check size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Intuitive Interface</h3>
                      <p className="text-muted-foreground">User-friendly platform designed for both beginners and experts.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-lg p-8">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className="flex mb-8">
                    <button
                      onClick={() => setActiveTab('signin')}
                      className={cn(
                        'flex-1 pb-2 text-center font-medium transition-colors border-b-2',
                        activeTab === 'signin'
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setActiveTab('signup')}
                      className={cn(
                        'flex-1 pb-2 text-center font-medium transition-colors border-b-2',
                        activeTab === 'signup'
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Sign Up
                    </button>
                  </div>
                  
                  {activeTab === 'signin' ? (
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="signin-email" className="block text-sm font-medium">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail size={18} className="text-muted-foreground" />
                          </div>
                          <input
                            id="signin-email"
                            type="email"
                            value={signinEmail}
                            onChange={(e) => setSigninEmail(e.target.value)}
                            placeholder="Your email address"
                            required
                            className="glass-input pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label htmlFor="signin-password" className="block text-sm font-medium">
                            Password
                          </label>
                          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock size={18} className="text-muted-foreground" />
                          </div>
                          <input
                            id="signin-password"
                            type={showPassword ? 'text' : 'password'}
                            value={signinPassword}
                            onChange={(e) => setSigninPassword(e.target.value)}
                            placeholder="Your password"
                            required
                            className="glass-input pl-10 pr-10 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} className="text-muted-foreground" />
                            ) : (
                              <Eye size={18} className="text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {loading ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                      
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-4 text-sm text-muted-foreground bg-card">Or continue with</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => handleProviderSignIn('google')}
                          className="glass-input border border-border bg-white hover:bg-muted/20 py-2 rounded-md flex items-center justify-center transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProviderSignIn('facebook')}
                          className="glass-input border border-border bg-white hover:bg-muted/20 py-2 rounded-md flex items-center justify-center transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProviderSignIn('github')}
                          className="glass-input border border-border bg-white hover:bg-muted/20 py-2 rounded-md flex items-center justify-center transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                            />
                          </svg>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="signup-name" className="block text-sm font-medium">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User size={18} className="text-muted-foreground" />
                          </div>
                          <input
                            id="signup-name"
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="Your full name"
                            required
                            className="glass-input pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signup-email" className="block text-sm font-medium">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail size={18} className="text-muted-foreground" />
                          </div>
                          <input
                            id="signup-email"
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="Your email address"
                            required
                            className="glass-input pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signup-password" className="block text-sm font-medium">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock size={18} className="text-muted-foreground" />
                          </div>
                          <input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            className="glass-input pl-10 pr-10 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} className="text-muted-foreground" />
                            ) : (
                              <Eye size={18} className="text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
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
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={loading || !agreeToTerms}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
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
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
