
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, Building, Loader2, DollarSign, CreditCard, Wallet, Plus, Lock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Import loadStripe outside the component to avoid re-initialization
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Plaid configuration
import { usePlaidLink } from 'react-plaid-link';

interface DepositModalProps {
  trigger?: React.ReactNode;
  onDepositSuccess?: () => void;
  defaultAmount?: number;
}

// Stripe configuration
const stripePromise = loadStripe('pk_test_51O5GtmE029DElfYsUcVxYQQNJVmnBjvjcFKvJccbJ3Ovq0fcJHAWjsYm9OnZHvFRc8T2XBgcOGvC4wdcAWk8jMeF00TKqQP8lO');

// Stripe Card Form Component
const StripeCardForm = ({ amount, onPaymentSuccess }: { amount: number, onPaymentSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Create a payment intent on the server
      const { data: intentData, error: intentError } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: amount.toString() }
      });

      if (intentError || !intentData?.clientSecret) {
        throw new Error(intentError?.message || 'Failed to create payment intent');
      }

      // Confirm the payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.user_metadata?.full_name || user.email,
              email: user.email,
            },
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Notify the server about the successful payment
        const { error: successError } = await supabase.functions.invoke('payment-success', {
          body: { 
            paymentIntentId: paymentIntent.id,
            amount: amount.toString()
          }
        });

        if (successError) {
          console.error('Error recording payment success:', successError);
        }

        toast.success(`Successfully deposited $${amount.toFixed(2)} to your account`);
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred processing your payment');
      toast.error('Payment failed: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-element">Credit or Debit Card</Label>
        <div className="p-3 border rounded-md bg-background">
          <CardElement
            id="card-element"
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
        {errorMessage && (
          <div className="text-sm text-destructive mt-1">{errorMessage}</div>
        )}
      </div>

      <div className="flex items-center bg-muted/50 p-2 rounded-md text-sm">
        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-muted-foreground">Secured by Stripe</span>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <DollarSign className="mr-2 h-4 w-4" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

// Main Deposit Modal Component
const DepositModal: React.FC<DepositModalProps> = ({ 
  trigger, 
  onDepositSuccess,
  defaultAmount = 0
}) => {
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [fromAccount, setFromAccount] = useState("wells-fargo");
  const [toAccount, setToAccount] = useState("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'amount' | 'payment-method' | 'bank-transfer' | 'card-payment' | 'review' | 'success'>('amount');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card'>('bank');
  const { user } = useAuth();

  const predefinedAmounts = [100, 300, 1000, 5000];

  // Plaid link setup
  const { open: openPlaidLink, ready: plaidReady } = usePlaidLink({
    token: 'link-sandbox-123', // This would be generated from your server in a real app
    onSuccess: (public_token, metadata) => {
      console.log('Plaid link success:', public_token, metadata);
      // In a real app, you would exchange the public token for an access token
      // and store the bank account information
      toast.success('Bank account connected successfully');
      
      // Move to the review step
      handleMockBankConnection();
    },
    onExit: (err, metadata) => {
      console.log('Plaid link exit:', err, metadata);
      if (err) {
        toast.error('Failed to connect bank account');
      }
    },
    onEvent: (eventName, metadata) => {
      console.log('Plaid link event:', eventName, metadata);
    }
  });

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setStep('payment-method');
  };

  const handleSelectPaymentMethod = (method: 'bank' | 'card') => {
    setPaymentMethod(method);
    
    if (method === 'bank') {
      setStep('bank-transfer');
    } else {
      setStep('card-payment');
    }
  };

  const handleBankConnect = () => {
    // In a real implementation, this would open the Plaid link
    if (plaidReady) {
      openPlaidLink();
    } else {
      // Fallback for demo without actual Plaid integration
      handleMockBankConnection();
    }
  };

  const handleMockBankConnection = () => {
    setStep('review');
  };

  const handleDepositSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call for bank transfer
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully deposited $${parseFloat(amount).toFixed(2)} to your account`);
      setStep('success');
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (error) {
      toast.error("Failed to process deposit. Please try again later.");
      console.error("Deposit error:", error);
      setStep('amount');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardPaymentSuccess = () => {
    setStep('success');
    
    if (onDepositSuccess) {
      onDepositSuccess();
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form after modal closes
    setTimeout(() => {
      setStep('amount');
      if (defaultAmount === 0) {
        setAmount('');
      }
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">Make a Deposit</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'amount' && (
          <>
            <DialogHeader>
              <DialogTitle>Transfer money</DialogTitle>
              <DialogDescription>
                Transfer money between your bank and StockPilot account.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="text-lg pl-10 h-12"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {predefinedAmounts.map((presetAmount) => (
                    <Button
                      key={presetAmount}
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleSelectAmount(presetAmount)}
                    >
                      ${presetAmount}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to-account">To</Label>
                <Select value={toAccount} onValueChange={setToAccount}>
                  <SelectTrigger id="to-account" className="w-full">
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2" />
                        <span>Individual Investing</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ira">
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2" />
                        <span>Roth IRA</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                <p>Deposits are typically available within 3-5 business days.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleContinue}>
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'payment-method' && (
          <>
            <DialogHeader>
              <DialogTitle>Choose payment method</DialogTitle>
              <DialogDescription>
                Select how you would like to make your deposit.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button 
                variant="outline" 
                className="h-32 flex flex-col" 
                onClick={() => handleSelectPaymentMethod('bank')}
              >
                <Building className="h-8 w-8 mb-2" />
                <span className="font-semibold">Bank Account</span>
                <span className="text-xs text-muted-foreground mt-1">3-5 business days</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-32 flex flex-col" 
                onClick={() => handleSelectPaymentMethod('card')}
              >
                <CreditCard className="h-8 w-8 mb-2" />
                <span className="font-semibold">Credit/Debit Card</span>
                <span className="text-xs text-muted-foreground mt-1">Instant deposit</span>
              </Button>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('amount')}>
                Back
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'bank-transfer' && (
          <>
            <DialogHeader>
              <DialogTitle>Connect your bank</DialogTitle>
              <DialogDescription>
                Select your bank or connect a new account.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Bank Account</Label>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between py-6" onClick={handleMockBankConnection}>
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-3" />
                      <span>Wells Fargo Everyday Checking</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-between py-6" onClick={handleMockBankConnection}>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>Chase Checking</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-between py-6" onClick={handleBankConnect}>
                    <div className="flex items-center">
                      <Plus className="h-5 w-5 mr-3" />
                      <span>Connect New Bank Account</span>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                <p>StockPilot uses Plaid to securely connect to your bank. Your credentials are never stored by StockPilot.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('payment-method')}>
                Back
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'card-payment' && (
          <>
            <DialogHeader>
              <DialogTitle>Enter card details</DialogTitle>
              <DialogDescription>
                Your card will be charged ${parseFloat(amount).toFixed(2)}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <Elements stripe={stripePromise}>
                <StripeCardForm 
                  amount={parseFloat(amount)} 
                  onPaymentSuccess={handleCardPaymentSuccess} 
                />
              </Elements>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('payment-method')}>
                Back
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'review' && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm your transfer</DialogTitle>
              <DialogDescription>
                Please review your transfer details before continuing.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-lg">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium">
                      {fromAccount === 'wells-fargo' ? 'Wells Fargo Checking' : 
                       fromAccount === 'chase' ? 'Chase Checking' : fromAccount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">
                      {toAccount === 'individual' ? 'Individual Investing' : 'Roth IRA'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated arrival</span>
                    <span className="font-medium">3-5 business days</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                <p>By proceeding, you authorize StockPilot to debit the indicated account for this payment and future payments in accordance with the terms.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('bank-transfer')}>
                Back
              </Button>
              <Button onClick={handleDepositSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit transfer"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle>Transfer initiated</DialogTitle>
              <DialogDescription>
                Your transfer has been submitted successfully.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4 text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              
              <div>
                <p className="text-xl font-semibold">${parseFloat(amount).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">will be deposited to your account</p>
              </div>
              
              <Card>
                <CardContent className="p-4 text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium">
                      {paymentMethod === 'bank' ? (
                        fromAccount === 'wells-fargo' ? 'Wells Fargo Checking' : 
                        fromAccount === 'chase' ? 'Chase Checking' : fromAccount
                      ) : (
                        'Credit/Debit Card'
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">
                      {toAccount === 'individual' ? 'Individual Investing' : 'Roth IRA'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated arrival</span>
                    <span className="font-medium">
                      {paymentMethod === 'bank' ? '3-5 business days' : 'Immediately'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter>
              <Button onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
