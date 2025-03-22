
import React from 'react';
import { useTitle } from '@/hooks/use-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import NewsFeed from '@/components/news/NewsFeed';

const FinancialNews = () => {
  useTitle('Financial News');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Financial News</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsFeed />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialNews;
