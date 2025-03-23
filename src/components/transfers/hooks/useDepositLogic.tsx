
import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useDepositLogic = (
  amount: string,
  onDepositSuccess?: () => void,
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [depositCompleted, setDepositCompleted] = useState(false);
  const { user } = useAuth();

  // Create a Plaid link token
  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('transfer-funds', {
          body: { action: 'create_link_token', user_id: user?.id }
        });
        
        if (error) throw error;
        if (data?.link_token) {
          setLinkToken(data.link_token);
        }
      } catch (err) {
        console.error('Error creating link token:', err);
        toast.error('Failed to connect to bank service');
      }
    };

    if (user) {
      createLinkToken();
    }
  }, [user]);

  // Handle Plaid success
  const onPlaidSuccess = useCallback(async (publicToken: string, metadata: any) => {
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('transfer-funds', {
        body: {
          action: 'exchange_public_token',
          public_token: publicToken,
          metadata,
          amount: parseFloat(amount),
          user_id: user.id
        }
      });
      
      if (error) throw error;
      
      toast.success(`Successfully deposited $${amount}`);
      setDepositCompleted(true);
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (err) {
      console.error('Error processing bank transfer:', err);
      toast.error('Failed to process bank transfer');
    } finally {
      setIsProcessing(false);
    }
  }, [amount, user, onDepositSuccess]);

  // Configure Plaid Link
  const { open: openPlaidLink } = usePlaidLink({
    token: linkToken || '',
    onSuccess: onPlaidSuccess,
    onExit: () => {
      console.log('User exited Plaid Link');
    },
  });

  // Handle Stripe payment
  const handleStripePayment = async () => {
    if (!user) {
      toast.error('You must be logged in to make a deposit');
      return;
    }

    setIsProcessing(true);
    try {
      // Process payment with Stripe
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: parseFloat(amount),
          user_id: user.id
        }
      });
      
      if (error) throw error;
      
      toast.success(`Successfully deposited $${amount}`);
      setDepositCompleted(true);
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (err) {
      console.error('Error processing card payment:', err);
      toast.error('Failed to process card payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle connecting a bank account
  const handleConnectBank = () => {
    if (linkToken) {
      openPlaidLink();
    } else {
      toast.error('Unable to connect to bank at this time');
    }
  };

  return {
    isProcessing,
    linkToken,
    depositCompleted,
    setDepositCompleted,
    handleConnectBank,
    handleStripePayment
  };
};
