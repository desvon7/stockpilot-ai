
import React from 'react';
import { Form } from '@/components/ui/form';
import OrderTypeField from './form/OrderTypeField';
import SharesField from './form/SharesField';
import ExecutionTypeField from './form/ExecutionTypeField';
import LimitPriceField from './form/LimitPriceField';
import SubmitButton from './form/SubmitButton';
import OrderSummary from './form/OrderSummary';
import OrderStockInfo from './form/OrderStockInfo';
import { useOrderFormLogic } from './form/useOrderFormLogic';

interface OrderFormProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  availableShares?: number;
  onOrderSuccess?: () => void;
  onInsufficientFunds?: (amount: number) => void;
  orderType?: 'market' | 'limit';
}

const OrderForm: React.FC<OrderFormProps> = ({
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

  return (
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
        <LimitPriceField 
          control={form.control} 
          show={executionTypeValue === 'limit'} 
        />
        
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
  );
};

export default OrderForm;
