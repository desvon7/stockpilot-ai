
import React, { useState } from 'react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AmountStep from './AmountStep';
import ReviewStep from './ReviewStep';
import SuccessStep from './SuccessStep';
import AddBankAccountForm from '../AddBankAccountForm';

export type LinkedAccount = {
  name: string;
  type: string;
  maskedNumber: string;
  verified: boolean;
  value: string;
};

interface DepositModalContentProps {
  defaultAmount?: number;
  onClose: () => void;
  onDepositSuccess?: () => void;
}

const DepositModalContent: React.FC<DepositModalContentProps> = ({ 
  defaultAmount = 0,
  onClose,
  onDepositSuccess
}) => {
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [fromAccount, setFromAccount] = useState("wells-fargo");
  const [toAccount, setToAccount] = useState("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'amount' | 'review' | 'success'>('amount');
  const [showAddBankForm, setShowAddBankForm] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    {
      name: 'Wells Fargo Everyday Checking',
      type: 'Checking',
      maskedNumber: '••••',
      verified: true,
      value: 'wells-fargo'
    },
    {
      name: 'Chase Checking',
      type: 'Checking',
      maskedNumber: '••••',
      verified: true,
      value: 'chase'
    }
  ]);

  const handleAddNewBank = () => {
    setShowAddBankForm(true);
  };

  const handleBankAdded = (account: {
    name: string;
    type: string;
    maskedNumber: string;
    verified: boolean;
  }) => {
    const newAccountValue = account.name.toLowerCase().replace(/\s+/g, '-');
    const newAccount = {
      ...account,
      value: newAccountValue
    };
    
    setLinkedAccounts([...linkedAccounts, newAccount]);
    setFromAccount(newAccountValue);
  };

  const handleDepositSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
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

  const getSelectedAccountName = () => {
    const account = linkedAccounts.find(acc => acc.value === fromAccount);
    return account ? account.name : '';
  };

  return (
    <>
      {step === 'amount' && (
        <>
          <DialogHeader>
            <DialogTitle>Transfer money</DialogTitle>
            <DialogDescription>
              Transfer money between your bank and StockPilot account.
            </DialogDescription>
          </DialogHeader>
          
          <AmountStep
            amount={amount}
            setAmount={setAmount}
            fromAccount={fromAccount}
            setFromAccount={setFromAccount}
            toAccount={toAccount}
            setToAccount={setToAccount}
            linkedAccounts={linkedAccounts}
            onReviewDeposit={() => setStep('review')}
            onCancel={onClose}
            onAddNewBank={handleAddNewBank}
          />
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
          
          <ReviewStep
            amount={amount}
            fromAccountName={getSelectedAccountName()}
            toAccount={toAccount}
            onBack={() => setStep('amount')}
            onSubmit={handleDepositSubmit}
            isSubmitting={isSubmitting}
          />
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
          
          <SuccessStep
            amount={amount}
            fromAccountName={getSelectedAccountName()}
            toAccount={toAccount}
            onClose={onClose}
          />
        </>
      )}

      <AddBankAccountForm 
        open={showAddBankForm} 
        onOpenChange={setShowAddBankForm} 
        onAccountAdded={handleBankAdded} 
      />
    </>
  );
};

export default DepositModalContent;
