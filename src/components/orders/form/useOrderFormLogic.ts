
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { orderFormSchema, OrderFormValues } from './OrderFormSchema';

interface UseOrderFormLogicProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  availableShares?: number;
  onOrderSuccess?: () => void;
  onInsufficientFunds?: (amount: number) => void;
  orderType?: 'market' | 'limit';
}

export const useOrderFormLogic = ({
  symbol,
  companyName,
  currentPrice,
  availableShares = 0,
  onOrderSuccess,
  onInsufficientFunds,
  orderType: defaultExecutionType = 'market'
}: UseOrderFormLogicProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyingPower, setBuyingPower] = useState(0);
  const { user } = useAuth();

  // Initialize form
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: 'buy',
      shares: '1',
      executionType: defaultExecutionType,
      limitPrice: currentPrice?.toFixed(2) ?? '0'
    }
  });

  // Fetch user's buying power on component mount
  useEffect(() => {
    const fetchBuyingPower = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('buying_power')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setBuyingPower(data?.buying_power || 0);
      } catch (error) {
        console.error('Error fetching buying power:', error);
      }
    };

    fetchBuyingPower();
  }, [user]);

  const orderTypeValue = form.watch('orderType');
  const sharesValue = form.watch('shares');
  const executionTypeValue = form.watch('executionType');
  
  // Calculate estimated total
  const sharesNum = Number(sharesValue) || 0;
  const estimatedTotal = sharesNum * currentPrice;

  // Handle form submission
  const onSubmit = async (values: OrderFormValues) => {
    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    if (values.orderType === 'sell' && sharesNum > availableShares) {
      toast.error(`You don't own enough shares of ${symbol} to sell ${sharesValue} shares`);
      return;
    }

    // Check if user has enough funds for buying
    if (values.orderType === 'buy' && estimatedTotal > buyingPower) {
      if (onInsufficientFunds) {
        onInsufficientFunds(Math.max(estimatedTotal - buyingPower, 10));
      } else {
        toast.error(`Insufficient funds. You need $${estimatedTotal.toFixed(2)} but only have $${buyingPower.toFixed(2)}`);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Execute the transaction through our dedicated edge function
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

      // If this was a market order, update the buying power immediately
      if (values.executionType === 'market') {
        if (values.orderType === 'buy') {
          const newBuyingPower = buyingPower - estimatedTotal;
          setBuyingPower(newBuyingPower);
          
          // Update in database
          await supabase
            .from('profiles')
            .update({ buying_power: newBuyingPower })
            .eq('id', user.id);
        } else if (values.orderType === 'sell') {
          const sellTotal = sharesNum * currentPrice;
          const newBuyingPower = buyingPower + sellTotal;
          setBuyingPower(newBuyingPower);
          
          // Update in database
          await supabase
            .from('profiles')
            .update({ buying_power: newBuyingPower })
            .eq('id', user.id);
        }
      }

      toast.success(`Order to ${values.orderType} ${values.shares} shares of ${symbol} was successful!`);
      
      // Reset form to default values
      form.reset({
        orderType: 'buy',
        shares: '1',
        executionType: defaultExecutionType,
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

  return {
    form,
    onSubmit,
    isSubmitting,
    buyingPower,
    orderTypeValue,
    sharesValue,
    executionTypeValue,
    estimatedTotal
  };
};

export default useOrderFormLogic;
