
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const OrderFormFooter: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <CardFooter className={`flex flex-col text-xs text-muted-foreground ${isMobile ? 'px-3 py-2' : ''}`}>
      <div className="flex items-start">
        <AlertCircle className="h-3 w-3 mr-1 mt-0.5 text-warning" />
        <p>Market orders execute at current market price. Prices may vary slightly from displayed quote.</p>
      </div>
      <div className="flex items-start mt-2">
        <Info className="h-3 w-3 mr-1 mt-0.5 text-info" />
        <p>Commission-free trading is available for standard U.S. equities trades.</p>
      </div>
    </CardFooter>
  );
};

export default React.memo(OrderFormFooter);
