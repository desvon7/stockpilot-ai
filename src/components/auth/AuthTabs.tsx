
import React from 'react';
import { cn } from '@/lib/utils';

type AuthTab = 'signin' | 'signup';

interface AuthTabsProps {
  activeTab: AuthTab;
  setActiveTab: (tab: AuthTab) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default AuthTabs;
