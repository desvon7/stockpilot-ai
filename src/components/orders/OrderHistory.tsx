
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  symbol: string;
  company_name: string;
  transaction_type: 'buy' | 'sell';
  shares: number;
  price_per_share: number;
  total_amount: number;
  status: string;
  created_at: string;
  execution_type?: string;
  limit_price?: number;
}

const OrderHistory: React.FC = () => {
  const { user } = useAuth();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['user-transactions'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Transaction[];
    },
    enabled: !!user
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning">
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading order history...</span>
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No orders found.</p>
            <p className="text-sm mt-2">Start trading to see your order history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Symbol</TableHead>
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
                    <TableCell className="text-right">{transaction.shares}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.price_per_share)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(transaction.total_amount)}</TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
