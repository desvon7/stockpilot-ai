
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { CardElement } from '@stripe/react-stripe-js';
import { ArrowRightIcon } from '../icons/TransferIcons';

interface CardTabContentProps {
  onStripePayment: () => void;
  isProcessing: boolean;
}

const CardTabContent: React.FC<CardTabContentProps> = ({ 
  onStripePayment, 
  isProcessing 
}) => {
  return (
    <TabsContent value="card" className="mt-2 space-y-4">
      <div className="border p-3 rounded-md">
        <div className="mb-4">
          <Label>Card Information</Label>
          <div className="mt-1 p-3 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
        
        <Button 
          onClick={onStripePayment}
          className="w-full"
          disabled={isProcessing}
        >
          <ArrowRightIcon />
          Make Deposit
        </Button>
      </div>
    </TabsContent>
  );
};

export default CardTabContent;
