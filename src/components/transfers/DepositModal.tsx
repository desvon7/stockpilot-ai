
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlaidLink } from 'react-plaid-link';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Bank, CreditCard, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Initialize Stripe outside of component to avoid re-initialization
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

export interface DepositModalProps {
  open: boolean;
  defaultAmount?: number;
  onDepositSuccess?: () => void;
  setShowDepositModal?: (show: boolean) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ 
  open, 
  defaultAmount = 0,
  onDepositSuccess,
  setShowDepositModal 
}) => {
  const [amount, setAmount] = useState(defaultAmount > 0 ? defaultAmount.toString() : '100');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('bank');
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [depositCompleted, setDepositCompleted] = useState(false);
  const { user } = useAuth();

  // Handle modal close
  const handleOpenChange = (open: boolean) => {
    if (setShowDepositModal) {
      setShowDepositModal(open);
    }
  };

  // Create a Plaid link token
  React.useEffect(() => {
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

    if (open && user) {
      createLinkToken();
    }
  }, [open, user]);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setDepositCompleted(false);
    }
  }, [open]);

  // Handle Plaid success
  const onPlaidSuccess = React.useCallback(async (publicToken: string, metadata: any) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('transfer-funds', {
        body: {
          action: 'exchange_public_token',
          public_token: publicToken,
          metadata,
          amount: parseFloat(amount),
          user_id: user?.id
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

  // Render the deposit form
  const renderDepositForm = () => (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="bank" className="flex items-center">
          <Bank className="h-4 w-4 mr-2" />
          Bank Account
        </TabsTrigger>
        <TabsTrigger value="card" className="flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          Card
        </TabsTrigger>
      </TabsList>
      
      <div className="mb-4">
        <Label htmlFor="amount">Deposit Amount</Label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            id="amount"
            type="text"
            inputMode="decimal"
            className="pl-8"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      
      <TabsContent value="bank" className="mt-2">
        <Button 
          onClick={handleConnectBank}
          className="w-full"
          disabled={isProcessing || !linkToken}
        >
          <Plus className="h-4 w-4 mr-2" />
          Connect Bank Account
        </Button>
      </TabsContent>
      
      <TabsContent value="card" className="mt-2 space-y-4">
        <div className="border p-3 rounded-md">
          <Elements stripe={stripePromise}>
            <div className="mb-4">
              <Label>Card Information</Label>
              <div className="mt-1 p-3 border rounded-md">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleStripePayment}
              className="w-full"
              disabled={isProcessing}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Make Deposit
            </Button>
          </Elements>
        </div>
      </TabsContent>
    </Tabs>
  );

  // Render success confirmation
  const renderSuccessConfirmation = () => (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-16 h-16 mb-4 text-green-500">
        <CheckCircle2 className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Deposit Successful!</h3>
      <p className="text-muted-foreground mb-6">
        ${amount} has been successfully added to your account.
      </p>
      <Button 
        onClick={() => handleOpenChange(false)}
        className="w-full"
      >
        Done
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {depositCompleted ? 'Deposit Complete' : 'Fund Your Account'}
          </DialogTitle>
          <DialogDescription>
            {depositCompleted ? 
              'Your funds have been added to your account.' : 
              'Choose a payment method to add funds to your account.'}
          </DialogDescription>
        </DialogHeader>
        
        {depositCompleted ? renderSuccessConfirmation() : renderDepositForm()}
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
