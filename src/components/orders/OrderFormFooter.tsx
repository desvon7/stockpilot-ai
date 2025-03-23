
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const OrderFormFooter: React.FC = () => {
  return (
    <CardFooter className="flex flex-col text-xs text-muted-foreground">
      <div className="flex items-start">
        <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
        <p>Market orders execute at current market price. Prices may vary slightly from displayed quote.</p>
      </div>
    </CardFooter>
  );
};

export default OrderFormFooter;
