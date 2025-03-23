
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
import { AlertCircle, Building, Loader2, DollarSign, CreditCard, Wallet, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import AddBankAccountForm from '@/components/transfers/AddBankAccountForm';

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
  const [step, setStep] = useState<'amount' | 'review' | 'success'>('amount');
  const [showAddBankForm, setShowAddBankForm] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState([
    {
      name: 'Wells Fargo Everyday Checking',
      type: 'Checking',
      maskedNumber: '••••',
      verified: true,
      value: 'wells-fargo'
    },
    {
      name: 'Chase Checking',
      type: 'Checking',
      maskedNumber: '••••',
      verified: true,
      value: 'chase'
    }
  ]);

  const predefinedAmounts = [100, 300, 1000, 5000];

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleAddNewBank = () => {
    setShowAddBankForm(true);
  };

  const handleBankAdded = (account: {
    name: string;
    type: string;
    maskedNumber: string;
    verified: boolean;
  }) => {
    const newAccountValue = account.name.toLowerCase().replace(/\s+/g, '-');
    const newAccount = {
      ...account,
      value: newAccountValue
    };
    
    setLinkedAccounts([...linkedAccounts, newAccount]);
    setFromAccount(newAccountValue);
  };

  const handleReviewDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setStep('review');
  };

  const handleDepositSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully deposited $${parseFloat(amount).toFixed(2)} to your account`);
      setStep('success');
      
      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (error) {
      toast.error("Failed to process deposit. Please try again later.");
      console.error("Deposit error:", error);
      setStep('amount');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form after modal closes
    setTimeout(() => {
      setStep('amount');
      if (defaultAmount === 0) {
        setAmount('');
      }
    }, 300);
  };

  const getSelectedAccountName = () => {
    const account = linkedAccounts.find(acc => acc.value === fromAccount);
    return account ? account.name : '';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="default">Make a Deposit</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          {step === 'amount' && (
            <>
              <DialogHeader>
                <DialogTitle>Transfer money</DialogTitle>
                <DialogDescription>
                  Transfer money between your bank and StockPilot account.
                </DialogDescription>
              </DialogHeader>
              
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
                      {linkedAccounts.map((account, index) => (
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
                      onClick={handleAddNewBank}
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleReviewDeposit}>
                  Review transfer
                </Button>
              </DialogFooter>
            </>
          )}

          {step === 'review' && (
            <>
              <DialogHeader>
                <DialogTitle>Confirm your transfer</DialogTitle>
                <DialogDescription>
                  Please review your transfer details before continuing.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium text-lg">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">From</span>
                      <span className="font-medium">{getSelectedAccountName()}</span>
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep('amount')}>
                  Back
                </Button>
                <Button onClick={handleDepositSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit transfer"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === 'success' && (
            <>
              <DialogHeader>
                <DialogTitle>Transfer initiated</DialogTitle>
                <DialogDescription>
                  Your transfer has been submitted successfully.
                </DialogDescription>
              </DialogHeader>
              
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
                      <span className="font-medium">{getSelectedAccountName()}</span>
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
              </div>
              
              <DialogFooter>
                <Button onClick={handleClose}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AddBankAccountForm 
        open={showAddBankForm} 
        onOpenChange={setShowAddBankForm} 
        onAccountAdded={handleBankAdded} 
      />
    </>
  );
};

export default DepositModal;
