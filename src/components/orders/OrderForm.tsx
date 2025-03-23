
import React, { memo } from 'react';
import { Form } from '@/components/ui/form';
import OrderTypeField from './form/OrderTypeField';
import SharesField from './form/SharesField';
import ExecutionTypeField from './form/ExecutionTypeField';
import LimitPriceField from './form/LimitPriceField';
import SubmitButton from './form/SubmitButton';
import OrderSummary from './form/OrderSummary';
import OrderStockInfo from './form/OrderStockInfo';
import { useOrderFormLogic } from './form/useOrderFormLogic';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';

interface OrderFormProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  availableShares?: number;
  onOrderSuccess?: () => void;
  onInsufficientFunds?: (amount: number) => void;
  orderType?: 'market' | 'limit';
}

// Memoize the component for better performance
const OrderForm: React.FC<OrderFormProps> = memo(({
  symbol,
  companyName,
  currentPrice,
  availableShares = 0,
  onOrderSuccess,
  onInsufficientFunds,
  orderType: defaultExecutionType = 'market'
}) => {
  const {
    form,
    onSubmit,
    isSubmitting,
    buyingPower,
    orderTypeValue,
    sharesValue,
    executionTypeValue,
    estimatedTotal
  } = useOrderFormLogic({
    symbol,
    companyName,
    currentPrice,
    availableShares,
    onOrderSuccess,
    onInsufficientFunds,
    orderType: defaultExecutionType
  });

  const isMobile = useIsMobile();

  return (
    <Card className={`p-4 ${isMobile ? 'rounded-xl shadow-lg' : ''}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <OrderStockInfo 
            currentPrice={currentPrice} 
            availableShares={availableShares}
            orderTypeValue={orderTypeValue}
          />
          
          <OrderTypeField control={form.control} />
          <SharesField control={form.control} />
          <ExecutionTypeField control={form.control} />
          
          {executionTypeValue === 'limit' && (
            <LimitPriceField 
              control={form.control} 
              show={true}
            />
          )}
          
          <OrderSummary 
            estimatedTotal={estimatedTotal} 
            buyingPower={buyingPower}
            orderTypeValue={orderTypeValue}
            symbol={symbol}
          />
          
          <SubmitButton 
            isSubmitting={isSubmitting} 
            orderTypeValue={orderTypeValue} 
            sharesValue={sharesValue} 
          />
        </form>
      </Form>
    </Card>
  );
});

OrderForm.displayName = 'OrderForm';
export default OrderForm;
