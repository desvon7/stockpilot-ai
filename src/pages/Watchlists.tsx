
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTitle } from '@/hooks/use-title';
import AccountLayout from '@/components/layout/AccountLayout';
import WatchlistsContainer from '@/components/watchlists/WatchlistsContainer';

const Watchlists: React.FC = () => {
  useTitle('Watchlists');
  
  return (
    <>
      <Helmet>
        <title>Watchlists | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Watchlists</h1>
          <p className="text-muted-foreground">
            Create watchlists to track your favorite stocks and investments.
          </p>
        </div>
        
        <WatchlistsContainer />
      </AccountLayout>
    </>
  );
};

export default Watchlists;
