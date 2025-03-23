
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AmountInputProps {
  amount: string;
  setAmount: (amount: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, setAmount }) => {
  return (
    <div className="mb-4">
      <Label htmlFor="amount">Deposit Amount</Label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          className="pl-8"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AmountInput;
