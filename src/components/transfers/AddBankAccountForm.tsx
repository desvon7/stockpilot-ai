
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddBankAccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountAdded: (account: {
    name: string;
    type: string;
    maskedNumber: string;
    verified: boolean;
  }) => void;
}

const AddBankAccountForm: React.FC<AddBankAccountFormProps> = ({
  open,
  onOpenChange,
  onAccountAdded,
}) => {
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!bankName) newErrors.bankName = 'Bank name is required';
    if (!routingNumber) newErrors.routingNumber = 'Routing number is required';
    else if (!/^\d{9}$/.test(routingNumber)) newErrors.routingNumber = 'Routing number must be 9 digits';
    
    if (!accountNumber) newErrors.accountNumber = 'Account number is required';
    if (accountNumber !== confirmAccountNumber) newErrors.confirmAccountNumber = 'Account numbers must match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBank = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create the new account object
      const newAccount = {
        name: bankName,
        type: accountType === 'checking' ? 'Checking' : 'Savings',
        maskedNumber: '••' + accountNumber.slice(-4),
        verified: false
      };
      
      toast.success(`Successfully added ${bankName} to your accounts. Verification needed.`);
      onAccountAdded(newAccount);
      onOpenChange(false);
      
      // Reset form
      setBankName('');
      setRoutingNumber('');
      setAccountNumber('');
      setConfirmAccountNumber('');
      setAccountType('checking');
      setErrors({});
    } catch (error) {
      toast.error("Failed to add bank account. Please try again later.");
      console.error("Add bank error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle>Add New Bank Account</SheetTitle>
          <SheetDescription>
            Link your bank account to deposit or withdraw funds.
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              className={errors.bankName ? "border-red-500" : ""}
            />
            {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account-type">Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger id="account-type">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="routing-number">Routing Number</Label>
            <Input
              id="routing-number"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder="9 digits"
              maxLength={9}
              className={errors.routingNumber ? "border-red-500" : ""}
            />
            {errors.routingNumber && <p className="text-red-500 text-sm">{errors.routingNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Account number"
              type="password"
              className={errors.accountNumber ? "border-red-500" : ""}
            />
            {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-account-number">Confirm Account Number</Label>
            <Input
              id="confirm-account-number"
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Re-enter account number"
              type="password"
              className={errors.confirmAccountNumber ? "border-red-500" : ""}
            />
            {errors.confirmAccountNumber && <p className="text-red-500 text-sm">{errors.confirmAccountNumber}</p>}
          </div>

          <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
            <p>By adding your bank account, you authorize StockPilot to initiate deposits and withdrawals from this account.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddBank} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Account"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddBankAccountForm;
