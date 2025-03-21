
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WatchlistsContainer from '@/components/watchlists/WatchlistsContainer';

const Watchlists: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Watchlists</h1>
            <p className="text-muted-foreground">
              Create watchlists to track your favorite stocks and investments.
            </p>
          </div>
          
          <WatchlistsContainer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Watchlists;
