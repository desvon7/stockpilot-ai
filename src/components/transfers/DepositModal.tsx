
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, Building, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DepositModalProps {
  trigger?: React.ReactNode;
  onDepositSuccess?: () => void;
  defaultAmount?: number;
}

const DepositModal: React.FC<DepositModalProps> = ({ 
  trigger, 
  onDepositSuccess,
  defaultAmount = 0
}) => {
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [fromAccount, setFromAccount] = useState("wells-fargo");
  const [toAccount, setToAccount] = useState("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const predefinedAmounts = [100, 300, 1000];

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleDepositSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully deposited $${parseFloat(amount).toFixed(2)} to your account`);
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }
      setOpen(false);
    } catch (error) {
      toast.error("Failed to process deposit. Please try again later.");
      console.error("Deposit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">Make a Deposit</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer money</DialogTitle>
          <DialogDescription>
            Transfer money between your bank and StockPilot account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="text"
              inputMode="decimal"
              placeholder="$0.00"
              className="text-lg"
            />
            <div className="flex gap-2 mt-2">
              {predefinedAmounts.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleSelectAmount(presetAmount)}
                >
                  ${presetAmount}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="from-account">From</Label>
            <Select value={fromAccount} onValueChange={setFromAccount}>
              <SelectTrigger id="from-account" className="w-full">
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wells-fargo" className="flex items-center">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Wells Fargo Everyday Checking</span>
                  </div>
                </SelectItem>
                <SelectItem value="add-new">+ Add New Bank Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="to-account">To</Label>
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger id="to-account" className="w-full">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="ira">Roth IRA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
            <p>Deposits are typically available within 3-5 business days.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDepositSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Review transfer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
