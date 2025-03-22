
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  DollarSign, 
  ArrowDownUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import InsufficientFundsModal from './InsufficientFundsModal';

// Form schema with validation
const orderFormSchema = z.object({
  orderType: z.enum(['buy', 'sell']),
  shares: z.string()
    .refine(val => !isNaN(Number(val)), { message: 'Must be a valid number' })
    .refine(val => Number(val) > 0, { message: 'Must be greater than 0' }),
  executionType: z.enum(['market', 'limit']),
  limitPrice: z.string().optional()
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  availableShares?: number;
  onOrderSuccess?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  symbol, 
  companyName,
  currentPrice,
  availableShares = 0,
  onOrderSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
  const { user } = useAuth();
  
  // Mock available funds - in a real app this would come from the user's account
  const availableFunds = 4.75;

  // Initialize form
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: 'buy',
      shares: '1',
      executionType: 'market',
      limitPrice: currentPrice?.toFixed(2) ?? '0'
    }
  });

  const orderType = form.watch('orderType');
  const shares = form.watch('shares');
  const executionType = form.watch('executionType');
  
  // Calculate estimated total
  const sharesNum = Number(shares) || 0;
  const estimatedTotal = sharesNum * currentPrice;

  // Handle form submission
  const onSubmit = async (values: OrderFormValues) => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    if (orderType === 'sell' && sharesNum > availableShares) {
      toast.error(`You don't own enough shares of ${symbol} to sell ${shares} shares`);
      return;
    }

    // Check if user has enough funds for buying
    if (orderType === 'buy' && estimatedTotal > availableFunds) {
      setShowInsufficientFundsModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('execute-stock-transaction', {
        body: {
          symbol,
          companyName,
          transaction_type: values.orderType,
          shares: Number(values.shares),
          price_per_share: currentPrice,
          execution_type: values.executionType,
          limit_price: values.executionType === 'limit' ? Number(values.limitPrice) : null
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`Order to ${values.orderType} ${values.shares} shares of ${symbol} was successful!`);
      
      // Reset form to default values
      form.reset({
        orderType: 'buy',
        shares: '1',
        executionType: 'market',
        limitPrice: currentPrice?.toFixed(2) ?? '0'
      });
      
      // Callback for refreshing data
      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(`Failed to execute order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trade {symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Price:</span>
                <span className="font-bold">
                  ${currentPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'Loading...'}
                </span>
              </div>
              
              {orderType === 'sell' && availableShares > 0 && (
                <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                  <span className="text-sm font-medium">You own:</span>
                  <span className="font-medium">{availableShares} shares</span>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Order Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Shares</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter shares amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="executionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Execution Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Execution Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {executionType === 'limit' && (
                <FormField
                  control={form.control}
                  name="limitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limit Price</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="text"
                          inputMode="decimal"
                          placeholder="Enter limit price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-sm font-medium">Estimated Total:</span>
                <span className="font-bold">
                  ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <Button 
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : orderType === 'buy' ? (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy {shares} Shares
                  </>
                ) : (
                  <>
                    <ArrowDownUp className="h-4 w-4 mr-2" />
                    Sell {shares} Shares
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col text-xs text-muted-foreground">
          <div className="flex items-start">
            <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
            <p>Market orders execute at current market price. Prices may vary slightly from displayed quote.</p>
          </div>
        </CardFooter>
      </Card>

      {/* Insufficient Funds Modal */}
      <InsufficientFundsModal
        open={showInsufficientFundsModal}
        onOpenChange={setShowInsufficientFundsModal}
        availableFunds={availableFunds}
        requiredAmount={Math.ceil(estimatedTotal - availableFunds)}
        onDismiss={() => setShowInsufficientFundsModal(false)}
      />
    </>
  );
};

export default OrderForm;
