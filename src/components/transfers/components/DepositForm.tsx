
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AmountInput from './AmountInput';
import BankTabContent from './BankTabContent';
import CardTabContent from './CardTabContent';
import { BankIcon, CardIcon } from '../icons/TransferIcons';

// Initialize Stripe outside of component to avoid re-initialization
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

interface DepositFormProps {
  amount: string;
  setAmount: (amount: string) => void;
  isProcessing: boolean;
  linkToken: string | null;
  onConnectBank: () => void;
  onStripePayment: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({
  amount,
  setAmount,
  isProcessing,
  linkToken,
  onConnectBank,
  onStripePayment
}) => {
  const [activeTab, setActiveTab] = useState<string>('bank');

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="bank" className="flex items-center">
          <BankIcon />
          Bank Account
        </TabsTrigger>
        <TabsTrigger value="card" className="flex items-center">
          <CardIcon />
          Card
        </TabsTrigger>
      </TabsList>
      
      <AmountInput amount={amount} setAmount={setAmount} />
      
      <BankTabContent 
        onConnectBank={onConnectBank}
        isProcessing={isProcessing}
        linkToken={linkToken}
      />
      
      <Elements stripe={stripePromise}>
        <CardTabContent
          onStripePayment={onStripePayment}
          isProcessing={isProcessing}
        />
      </Elements>
    </Tabs>
  );
};

export default DepositForm;
