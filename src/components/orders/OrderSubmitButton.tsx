
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, ArrowDownUp, ShoppingCart, TrendingDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const displayShares = shares ? shares : '0';
  
  const getButtonColor = () => {
    return orderType === 'buy' 
      ? 'bg-success hover:bg-success/90 text-white' 
      : 'bg-destructive hover:bg-destructive/90 text-white';
  };
  
  return (
    <Button 
      type="submit"
      className={`w-full ${getButtonColor()} transition-colors shadow-sm`}
      disabled={isSubmitting}
      size={isMobile ? "sm" : "default"}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : orderType === 'buy' ? (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy {displayShares} Shares
        </>
      ) : (
        <>
          <TrendingDown className="h-4 w-4 mr-2" />
          Sell {displayShares} Shares
        </>
      )}
    </Button>
  );
};

export default React.memo(OrderSubmitButton);
