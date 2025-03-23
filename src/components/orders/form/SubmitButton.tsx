
import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, ArrowDownUp, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  orderTypeValue: 'buy' | 'sell';
  sharesValue: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isSubmitting, 
  orderTypeValue, 
  sharesValue 
}) => {
  return (
    <Button 
      type="submit"
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : orderTypeValue === 'buy' ? (
        <>
          <DollarSign className="h-4 w-4 mr-2" />
          Buy {sharesValue} Shares
        </>
      ) : (
        <>
          <ArrowDownUp className="h-4 w-4 mr-2" />
          Sell {sharesValue} Shares
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
