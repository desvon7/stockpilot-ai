
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, ArrowDownUp } from 'lucide-react';

interface OrderSubmitButtonProps {
  isSubmitting: boolean;
  orderType: 'buy' | 'sell';
  shares: string;
}

const OrderSubmitButton: React.FC<OrderSubmitButtonProps> = ({ 
  isSubmitting, 
  orderType, 
  shares 
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
      ) : orderType === 'buy' ? (
        <>
          <DollarSign className="h-4 w-4 mr-2" />
          Buy {shares} Shares
        </>
      ) : (
        <>
          <ArrowDownUp className="h-4 w-4 mr-2" />
          Sell {shares} Shares
        </>
      )}
    </Button>
  );
};

export default OrderSubmitButton;
