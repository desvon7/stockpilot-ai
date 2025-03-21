
import React from 'react';
import { Apple } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Provider = 'google' | 'apple' | 'facebook';

const SocialAuthButtons: React.FC = () => {
  const { signInWithProvider } = useAuth();
  
  const handleProviderSignIn = async (provider: Provider) => {
    await signInWithProvider(provider);
  };

  return (
    <>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M17.13 17.21c-1.74 1.13-3.9 1.5-6 .9-2.48-.7-4.32-2.75-4.8-5.29"></path>
            <path d="M6.73 7.3C7.84 5.8 9.54 4.94 11.5 5c2.11.06 4 1.14 5.1 2.59"></path>
            <path d="m8 11 4 4"></path>
            <path d="m16 11-4 4"></path>
          </svg>
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
    </>
  );
};

export default SocialAuthButtons;
