
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
      if (!user) return;
      
      try {
        setIsProcessing(true);
        const { data, error } = await supabase.functions.invoke('transfer-funds', {
          body: { action: 'create_link_token', user_id: user.id }
        });
        
        if (error) throw error;
        if (data?.link_token) {
          console.log("Link token created:", data.link_token);
          setLinkToken(data.link_token);
        }
      } catch (err) {
        console.error('Error creating link token:', err);
        toast.error('Failed to connect to bank service');
      } finally {
        setIsProcessing(false);
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
      console.log("Processing deposit with amount:", amount);
      
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
      
      if (!data.success) {
        throw new Error(data.error || 'Transaction failed');
      }
      
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

  // Handle mock bank connection (since we don't have a real Plaid integration)
  const handleConnectBank = () => {
    if (!user) {
      toast.error('You must be logged in to make a deposit');
      return;
    }
    
    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    // Create a mock public token that would normally come from Plaid
    const mockPublicToken = `mock-public-token-${Date.now()}`;
    const mockMetadata = {
      institution: {
        name: 'Mock Bank',
        institution_id: 'mock_inst'
      },
      account: {
        id: 'mock_account_id',
        name: 'Mock Checking Account',
        mask: '1234'
      }
    };
    
    // Call the same handler that would be called by Plaid
    onPlaidSuccess(mockPublicToken, mockMetadata);
  };

  // Handle Stripe payment (mock implementation)
  const handleStripePayment = async () => {
    if (!user) {
      toast.error('You must be logged in to make a deposit');
      return;
    }

    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      // Process a deposit with the same backend endpoint
      const { data, error } = await supabase.functions.invoke('transfer-funds', {
        body: {
          action: 'exchange_public_token',
          public_token: 'mock-card-payment',
          metadata: { payment_method: 'card' },
          amount: parseFloat(amount),
          user_id: user.id
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || 'Transaction failed');
      }
      
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

  return {
    isProcessing,
    linkToken,
    depositCompleted,
    setDepositCompleted,
    handleConnectBank,
    handleStripePayment
  };
};

export default useDepositLogic;
