
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import DepositModal from '@/components/transfers/DepositModal';

interface InsufficientFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableFunds: number;
  requiredAmount?: number;
  onDismiss?: () => void;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({
  open,
  onOpenChange,
  availableFunds,
  requiredAmount,
  onDismiss
}) => {
  const [showDepositModal, setShowDepositModal] = React.useState(false);
  
  const handleDepositSuccess = () => {
    // Close both modals
    setShowDepositModal(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] bg-gray-900 text-white border-gray-800">
          <DialogHeader className="gap-0">
            <AlertCircle className="h-8 w-8 text-white mb-2" />
            <DialogTitle className="text-xl text-white">
              Not Enough Buying Power
            </DialogTitle>
          </DialogHeader>
          
          <DialogDescription className="text-gray-300 pt-2">
            Edit your order or make a deposit in your individual account to continue.
          </DialogDescription>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white w-full h-12"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => setShowDepositModal(true), 100);
              }}
            >
              Make Deposit
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-12 bg-transparent text-green-500 border-gray-700 hover:bg-gray-800 hover:text-green-400"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          </div>
          
          <div className="text-center text-gray-400 text-sm pt-2 border-t border-gray-800 mt-2">
            ${availableFunds.toFixed(2)} buying power available
          </div>
        </DialogContent>
      </Dialog>

      <DepositModal
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
        onDepositSuccess={handleDepositSuccess}
        defaultAmount={requiredAmount || 0}
      />
    </>
  );
};

export default InsufficientFundsModal;
