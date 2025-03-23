
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from "@/components/ui/card";
import { Form } from '@/components/ui/form';
import InsufficientFundsModal from './InsufficientFundsModal';
import { useOrderForm } from '@/hooks/useOrderForm';
import OrderTypeField from './OrderTypeField';
import SharesField from './SharesField';
import ExecutionTypeField from './ExecutionTypeField';
import LimitPriceField from './LimitPriceField';
import OrderSummary from './OrderSummary';
import OrderSubmitButton from './OrderSubmitButton';
import OrderFormFooter from './OrderFormFooter';

interface OrderFormProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  availableShares?: number;
  onOrderSuccess?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  symbol, 
  companyName,
  currentPrice,
  availableShares = 0,
  onOrderSuccess
}) => {
  // Using 4.75 as a hardcoded value like in the original component
  const availableFunds = 4.75;
  
  const {
    form,
    orderType,
    shares,
    executionType,
    sharesNum,
    estimatedTotal,
    isSubmitting,
    showInsufficientFundsModal,
    setShowInsufficientFundsModal,
    onSubmit
  } = useOrderForm(
    symbol,
    companyName,
    currentPrice,
    availableShares,
    availableFunds,
    onOrderSuccess
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trade {symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Price:</span>
                <span className="font-bold">
                  ${currentPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'Loading...'}
                </span>
              </div>
              
              {orderType === 'sell' && availableShares > 0 && (
                <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                  <span className="text-sm font-medium">You own:</span>
                  <span className="font-medium">{availableShares} shares</span>
                </div>
              )}
              
              <OrderTypeField form={form} />
              <SharesField form={form} />
              <ExecutionTypeField form={form} />
              <LimitPriceField form={form} show={executionType === 'limit'} />
              <OrderSummary estimatedTotal={estimatedTotal} />
              <OrderSubmitButton 
                isSubmitting={isSubmitting} 
                orderType={orderType} 
                shares={shares} 
              />
            </form>
          </Form>
        </CardContent>
        <OrderFormFooter />
      </Card>

      <InsufficientFundsModal
        open={showInsufficientFundsModal}
        onOpenChange={setShowInsufficientFundsModal}
        availableFunds={availableFunds}
        requiredAmount={estimatedTotal}
        onDismiss={() => setShowInsufficientFundsModal(false)}
      />
    </>
  );
};

export default OrderForm;
