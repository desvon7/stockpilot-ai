
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AuthTabs from '@/components/auth/AuthTabs';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

type AuthTab = 'signin' | 'signup';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const { user, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Add an effect to set local loading to false after auth context has initialized
  useEffect(() => {
    // Short timeout to ensure auth context is fully initialized
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  if (user && !loading) {
    return <Navigate to="/home" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#11131E] text-white">
      <Navbar />
      <main className="flex-grow pt-12 pb-12 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-[#171B2D] rounded-lg p-6">
            {localLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                
                {activeTab === 'signin' ? (
                  <>
                    <SignInForm />
                    <SocialAuthButtons />
                  </>
                ) : (
                  <>
                    <SignUpForm />
                    <SocialAuthButtons />
                  </>
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
