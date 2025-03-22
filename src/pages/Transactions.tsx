
import React from 'react';
import { useTitle } from '@/hooks/use-title';
import OrderHistory from '@/components/orders/OrderHistory';
import Navbar from '@/components/layout/Navbar';
import Alert from '@/components/auth/Alert';

const Transactions = () => {
  useTitle('Transaction History');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Alert />
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        <OrderHistory />
      </div>
    </div>
  );
};

export default Transactions;
