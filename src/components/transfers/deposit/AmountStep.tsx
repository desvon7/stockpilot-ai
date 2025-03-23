
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Building, DollarSign, PlusCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

interface AmountStepProps {
  amount: string;
  setAmount: (amount: string) => void;
  fromAccount: string;
  setFromAccount: (account: string) => void;
  toAccount: string;
  setToAccount: (account: string) => void;
  linkedAccounts: Array<{
    name: string;
    type: string;
    maskedNumber: string;
    verified: boolean;
    value: string;
  }>;
  onReviewDeposit: () => void;
  onCancel: () => void;
  onAddNewBank: () => void;
}

const AmountStep: React.FC<AmountStepProps> = ({
  amount,
  setAmount,
  fromAccount,
  setFromAccount,
  toAccount,
  setToAccount,
  linkedAccounts,
  onReviewDeposit,
  onCancel,
  onAddNewBank
}) => {
  const predefinedAmounts = [100, 300, 1000, 5000];

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleReviewDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    onReviewDeposit();
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className="text-lg pl-10 h-12"
          />
        </div>
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
            {linkedAccounts.map((account) => (
              <SelectItem key={account.value} value={account.value} className="flex items-center">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{account.name}</span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value="add-new" className="text-primary">
              <div className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>Add New Bank Account</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {fromAccount === 'add-new' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-full"
            onClick={onAddNewBank}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Bank Account
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="to-account">To</Label>
        <Select value={toAccount} onValueChange={setToAccount}>
          <SelectTrigger id="to-account" className="w-full">
            <SelectValue placeholder="Select destination account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                <span>Individual Investing</span>
              </div>
            </SelectItem>
            <SelectItem value="ira">
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                <span>Roth IRA</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
        <p>Deposits are typically available within 3-5 business days.</p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleReviewDeposit}>
          Review transfer
        </Button>
      </div>
    </div>
  );
};

export default AmountStep;
