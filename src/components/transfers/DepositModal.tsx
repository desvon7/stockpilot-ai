
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDepositLogic } from './hooks/useDepositLogic';
import DepositForm from './components/DepositForm';
import DepositSuccess from './components/DepositSuccess';

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
  
  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setDepositCompleted(false);
    }
  }, [open]);

  // Custom hook for deposit logic
  const {
    isProcessing,
    linkToken,
    depositCompleted,
    setDepositCompleted,
    handleConnectBank,
    handleStripePayment
  } = useDepositLogic(amount, onDepositSuccess);

  // Handle modal close
  const handleOpenChange = (open: boolean) => {
    if (setShowDepositModal) {
      setShowDepositModal(open);
    }
  };

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
        
        {depositCompleted ? (
          <DepositSuccess 
            amount={amount} 
            onClose={() => handleOpenChange(false)} 
          />
        ) : (
          <DepositForm
            amount={amount}
            setAmount={setAmount}
            isProcessing={isProcessing}
            linkToken={linkToken}
            onConnectBank={handleConnectBank}
            onStripePayment={handleStripePayment}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
