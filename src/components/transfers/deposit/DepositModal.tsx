
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import DepositModalContent from './DepositModalContent';

interface DepositModalProps {
  trigger?: React.ReactNode;
  onDepositSuccess?: () => void;
  defaultAmount?: number;
}

const DepositModal: React.FC<DepositModalProps> = ({ 
  trigger, 
  onDepositSuccess,
  defaultAmount = 0
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="w-full">Make a Deposit</button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DepositModalContent
          defaultAmount={defaultAmount}
          onClose={handleClose}
          onDepositSuccess={onDepositSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
