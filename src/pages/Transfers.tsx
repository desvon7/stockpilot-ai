
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, ArrowRight, Upload, CreditCard, RefreshCw, Building, PlusCircle, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DepositModal from '@/components/transfers/DepositModal';
import { toast } from 'sonner';

const Transfers: React.FC = () => {
  // States for various dialogs and forms
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('wells-fargo');
  const [toAccount, setToAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [addBankIsSubmitting, setAddBankIsSubmitting] = useState(false);

  // Predefined transfer amounts
  const predefinedAmounts = [100, 300, 1000];

  // Mock completed transfers history
  const [transfers, setTransfers] = useState([
    {
      type: 'Deposit to individual',
      source: 'Wells Fargo Everyday Checking',
      account: 'Individual',
      date: 'Jan 31',
      amount: 400.00
    },
    {
      type: 'Deposit to individual',
      source: 'Wells Fargo Everyday Checking',
      account: 'Individual',
      date: 'Jan 27',
      amount: 150.00
    }
  ]);

  // Available funds to withdraw
  const availableFunds = [
    { type: 'Individual cash available', amount: 4.75 },
    { type: 'Spending cash available', amount: 0.00 },
    { type: 'Roth IRA cash available', amount: 0.00 }
  ];

  // Linked accounts
  const [linkedAccounts, setLinkedAccounts] = useState([
    {
      name: 'Wells Fargo Everyday Checking',
      type: 'Checking',
      maskedNumber: '••••',
      verified: true
    }
  ]);

  const handleSelectAmount = (value: number) => {
    setTransferAmount(value.toString());
  };

  const handleTransferSubmit = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!toAccount) {
      toast.error("Please select a destination account");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the new transfer to the list
      const newTransfer = {
        type: `Deposit to ${toAccount}`,
        source: 'Wells Fargo Everyday Checking',
        account: toAccount === 'individual' ? 'Individual' : 'Roth IRA',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: parseFloat(transferAmount)
      };
      
      setTransfers([newTransfer, ...transfers]);
      
      toast.success(`Successfully initiated transfer of $${parseFloat(transferAmount).toFixed(2)} to your account`);
      setShowTransferModal(false);
      setTransferAmount('');
      setToAccount('');
    } catch (error) {
      toast.error("Failed to process transfer. Please try again later.");
      console.error("Transfer error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBank = async () => {
    if (!bankName || !routingNumber || !accountNumber) {
      toast.error("Please fill out all required fields");
      return;
    }

    setAddBankIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the new bank account to the list
      const newAccount = {
        name: bankName,
        type: accountType === 'checking' ? 'Checking' : 'Savings',
        maskedNumber: '••' + accountNumber.slice(-4),
        verified: false
      };
      
      setLinkedAccounts([...linkedAccounts, newAccount]);
      
      toast.success(`Successfully added ${bankName} to your accounts. Verification needed.`);
      setShowAddBankModal(false);
      
      // Reset form
      setBankName('');
      setRoutingNumber('');
      setAccountNumber('');
      setAccountType('checking');
    } catch (error) {
      toast.error("Failed to add bank account. Please try again later.");
      console.error("Add bank error:", error);
    } finally {
      setAddBankIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Transfers | StockPilot</title>
      </Helmet>
      
      <AccountLayout>
        <div className="border-b border-border pb-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <nav className="flex space-x-4 text-sm font-medium overflow-x-auto pb-2">
              {['Investing', 'Spending', 'Crypto', 'Transfers', 'Recurring', 'Stock Lending', 'Reports and statements', 'Tax center', 'History', 'Settings', 'Help'].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className={`${item === 'Transfers' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} px-2 py-1 whitespace-nowrap`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Start a transfer</h1>
          <p className="mb-6">
            Learn more about your <button className="text-primary">transfer limits</button>.
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <ArrowRight className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Transfer accounts</div>
              <div className="text-green-500 text-sm mb-1">For a limited time, get 2% extra with Gold.</div>
              <div className="text-muted-foreground text-sm">Transfer your outside brokerage accounts into Robinhood.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          <div onClick={() => setShowTransferModal(true)} className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Building className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Transfer money</div>
              <div className="text-muted-foreground text-sm">Transfer money between your bank and your Robinhood account.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Set up direct deposit</div>
              <div className="text-muted-foreground text-sm">Get your paycheck deposited directly into your Robinhood account.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Upload className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Send a wire transfer</div>
              <div className="text-muted-foreground text-sm">Transfer to or from your brokerage account, typically within 1 business day.</div>
            </div>
            <div className="self-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Available to withdraw</h2>
          <p className="text-muted-foreground mb-4">Exclusions may apply, depending on your account type and activity.</p>
          
          {availableFunds.map((fund, index) => (
            <div key={index} className="flex justify-between items-center py-3">
              <div className="flex items-center gap-2">
                {fund.type}
                <button className="text-muted-foreground">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                  </svg>
                </button>
              </div>
              <div className="font-medium">${fund.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Linked Accounts</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAddBankModal(true)}
              className="text-primary hover:text-primary/90"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Account
            </Button>
          </div>
          
          {linkedAccounts.map((account, index) => (
            <div key={index} className="flex justify-between items-center border-b border-border py-4">
              <div className="flex gap-4">
                <Building className="w-8 h-8" />
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-muted-foreground">{account.type} {account.maskedNumber}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={account.verified ? "text-muted-foreground" : "text-amber-500"}>
                  {account.verified ? 'Verified' : 'Verification Needed'}
                </span>
                <Button variant="outline" size="sm">Unlink</Button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Transfers</h2>
          
          {transfers.map((transfer, index) => (
            <div key={index} className="flex justify-between items-center border-b border-border py-4">
              <div>
                <div className="font-medium">{transfer.type} from {transfer.source}</div>
                <div className="text-muted-foreground">{transfer.account} • {transfer.date}</div>
              </div>
              <div className="font-medium text-green-500">+${transfer.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Add Bank Account Modal */}
        <Dialog open={showAddBankModal} onOpenChange={setShowAddBankModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
              <DialogDescription>
                Connect your bank account to deposit or withdraw funds.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name"
                />
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
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="9 digits"
                  maxLength={9}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account number"
                  type="password"
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-md flex items-start text-sm">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                <p>By adding your bank account, you authorize StockPilot to initiate deposits and withdrawals from this account.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddBankModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBank} disabled={addBankIsSubmitting}>
                {addBankIsSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Add Account"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transfer Money Modal */}
        <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
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
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
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
                    {linkedAccounts.slice(1).map((account, index) => (
                      <SelectItem key={index} value={`account-${index}`}>
                        {account.name}
                      </SelectItem>
                    ))}
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
              <Button variant="outline" onClick={() => setShowTransferModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleTransferSubmit} disabled={isSubmitting}>
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
      </AccountLayout>
    </>
  );
};

export default Transfers;
