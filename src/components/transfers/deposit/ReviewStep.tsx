
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

interface ReviewStepProps {
  amount: string;
  fromAccountName: string;
  toAccount: string;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  amount,
  fromAccountName,
  toAccount,
  onBack,
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="space-y-4 pt-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium text-lg">${parseFloat(amount).toFixed(2)}</span>
          </div>
          
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

      <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
        <p>By proceeding, you authorize StockPilot to debit the indicated account for this payment and future payments in accordance with the terms.</p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit transfer"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
