
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface SuccessStepProps {
  amount: string;
  fromAccountName: string;
  toAccount: string;
  onClose: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  amount,
  fromAccountName,
  toAccount,
  onClose
}) => {
  return (
    <div className="space-y-4 pt-4 text-center">
      <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
        <DollarSign className="h-8 w-8 text-green-600 dark:text-green-300" />
      </div>
      
      <div>
        <p className="text-xl font-semibold">${parseFloat(amount).toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">will be deposited to your account</p>
      </div>
      
      <Card>
        <CardContent className="p-4 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">From</span>
            <span className="font-medium">{fromAccountName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">To</span>
            <span className="font-medium">
              {toAccount === 'individual' ? 'Individual Investing' : 'Roth IRA'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Estimated arrival</span>
            <span className="font-medium">3-5 business days</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
};

export default SuccessStep;
