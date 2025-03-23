
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AccountLayout from '@/components/layout/AccountLayout';
import { toast } from 'sonner';
import DepositModal from '@/components/transfers/deposit/DepositModal';
import AddBankAccountForm from '@/components/transfers/AddBankAccountForm';
import TransferOptionsSection from '@/components/transfers/sections/TransferOptionsSection';
import AvailableFundsSection from '@/components/transfers/sections/AvailableFundsSection';
import LinkedAccountsSection from '@/components/transfers/sections/LinkedAccountsSection';
import CompletedTransfersSection from '@/components/transfers/sections/CompletedTransfersSection';

const Transfers: React.FC = () => {
  // States for various dialogs and forms
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleBankAdded = (account: {
    name: string; 
    type: string; 
    maskedNumber: string; 
    verified: boolean;
  }) => {
    setLinkedAccounts([...linkedAccounts, account]);
    toast.success(`${account.name} has been added to your accounts`);
  };

  const handleDepositSuccess = (amount: number, source: string, destination: string) => {
    // Add the new transfer to the list
    const newTransfer = {
      type: `Deposit to ${destination}`,
      source: source,
      account: destination === 'individual' ? 'Individual' : 'Roth IRA',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: amount
    };
    
    setTransfers([newTransfer, ...transfers]);
    toast.success(`Successfully initiated transfer of $${amount.toFixed(2)} to your account`);
  };

  const handleUnlinkAccount = (index: number) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedAccounts = [...linkedAccounts];
      const removedAccount = updatedAccounts.splice(index, 1)[0];
      setLinkedAccounts(updatedAccounts);
      toast.success(`Successfully unlinked ${removedAccount.name}`);
      setIsSubmitting(false);
    }, 1000);
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
        
        <TransferOptionsSection depositModalTrigger={<DepositModal />} />
        
        <AvailableFundsSection funds={availableFunds} />
        
        <LinkedAccountsSection 
          accounts={linkedAccounts} 
          onAddAccount={() => setShowAddBankModal(true)}
          onUnlinkAccount={handleUnlinkAccount}
          isSubmitting={isSubmitting}
        />
        
        <CompletedTransfersSection transfers={transfers} />

        <AddBankAccountForm 
          open={showAddBankModal} 
          onOpenChange={setShowAddBankModal} 
          onAccountAdded={handleBankAdded}
        />
      </AccountLayout>
    </>
  );
};

export default Transfers;
