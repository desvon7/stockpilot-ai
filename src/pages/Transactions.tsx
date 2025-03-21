
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useQuery } from '@tanstack/react-query';
import { getUserTransactions } from '@/services/portfolioService';
import { formatCurrency, formatDate, getColorByChange } from '@/utils/formatters';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';

const Transactions: React.FC = () => {
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getUserTransactions,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Transaction History</h1>
            <p className="text-muted-foreground">
              Review your past trades and transactions.
            </p>
          </div>
          
          <div className="glass-card rounded-lg p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading transaction history...</span>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-destructive">
                <p>Error loading transactions. Please try again later.</p>
                <p className="text-sm mt-2">{(error as Error).message}</p>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.transaction_type === 'buy' ? (
                              <>
                                <ArrowUpCircle className="h-4 w-4 mr-1 text-green-500" />
                                <span>Buy</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownCircle className="h-4 w-4 mr-1 text-red-500" />
                                <span>Sell</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{transaction.symbol}</TableCell>
                        <TableCell>{transaction.company_name}</TableCell>
                        <TableCell className="text-right">{transaction.shares}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.price_per_share)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(transaction.total_amount)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs
                            ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              transaction.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No transactions found.</p>
                <p className="text-sm mt-2">Start trading to see your transaction history.</p>
                <Link to="/dashboard" className="mt-4 inline-block text-primary hover:underline">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Transactions;
