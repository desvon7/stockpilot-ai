
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const orderFormSchema = z.object({
  orderType: z.enum(['buy', 'sell']),
  shares: z.string()
    .refine(val => !isNaN(Number(val)), { message: 'Must be a valid number' })
    .refine(val => Number(val) > 0, { message: 'Must be greater than 0' }),
  executionType: z.enum(['market', 'limit']),
  limitPrice: z.string().optional()
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const useOrderForm = (
  symbol: string,
  companyName: string,
  currentPrice: number,
  availableShares: number = 0,
  availableFunds: number,
  onOrderSuccess?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
  const { user } = useAuth();

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
  
  const sharesNum = Number(shares) || 0;
  const estimatedTotal = sharesNum * currentPrice;

  const onSubmit = async (values: OrderFormValues) => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    if (orderType === 'sell' && sharesNum > availableShares) {
      toast.error(`You don't own enough shares of ${symbol} to sell ${shares} shares`);
      return;
    }

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
      
      form.reset({
        orderType: 'buy',
        shares: '1',
        executionType: 'market',
        limitPrice: currentPrice?.toFixed(2) ?? '0'
      });
      
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

  return {
    form,
    orderType,
    shares,
    executionType,
    sharesNum,
    estimatedTotal,
    isSubmitting,
    showInsufficientFundsModal,
    setShowInsufficientFundsModal,
    onSubmit
  };
};
