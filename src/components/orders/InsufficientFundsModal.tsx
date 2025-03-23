
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import DepositModal from '@/components/transfers/deposit/DepositModal';

interface InsufficientFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredAmount: number;
  availableFunds?: number;
  onDismiss?: () => void;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({
  open,
  onOpenChange,
  requiredAmount,
  availableFunds,
  onDismiss,
}) => {
  const handleClose = () => {
    onOpenChange(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insufficient Funds</DialogTitle>
          <DialogDescription>
            You do not have enough funds available to place this order.
          </DialogDescription>
        </DialogHeader>
        {availableFunds !== undefined && (
          <div className="flex items-center space-x-2 p-4 rounded-md border border-border bg-background">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm">
              Available: ${availableFunds.toFixed(2)}<br />
              Required: ${requiredAmount.toFixed(2)}
            </p>
          </div>
        )}
        {availableFunds === undefined && (
          <div className="flex items-center space-x-2 p-4 rounded-md border border-border bg-background">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm">
              You need ${requiredAmount.toFixed(2)} to place this order.
            </p>
          </div>
        )}
        <DialogFooter className="sm:justify-start">
          <DepositModal 
            trigger={
              <Button>
                Make a Deposit
              </Button>
            }
            onDepositSuccess={() => onOpenChange(false)}
            defaultAmount={requiredAmount}
          />
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsufficientFundsModal;
