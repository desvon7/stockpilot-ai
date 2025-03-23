
import React from 'react';
import { Button } from "@/components/ui/button";
import { SuccessIcon } from '../icons/TransferIcons';

interface DepositSuccessProps {
  amount: string;
  onClose: () => void;
}

const DepositSuccess: React.FC<DepositSuccessProps> = ({ amount, onClose }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-16 h-16 mb-4 text-green-500">
        <SuccessIcon />
      </div>
      <h3 className="text-xl font-semibold mb-2">Deposit Successful!</h3>
      <p className="text-muted-foreground mb-6">
        ${amount} has been successfully added to your account.
      </p>
      <Button 
        onClick={onClose}
        className="w-full"
      >
        Done
      </Button>
    </div>
  );
};

export default DepositSuccess;
