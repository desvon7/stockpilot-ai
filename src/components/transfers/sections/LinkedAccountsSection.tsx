
import React from 'react';
import { Button } from "@/components/ui/button";
import { Building, Loader2 } from "lucide-react";

interface BankAccount {
  name: string;
  type: string;
  maskedNumber: string;
  verified: boolean;
}

interface LinkedAccountsSectionProps {
  accounts: BankAccount[];
  onAddAccount: () => void;
  onUnlinkAccount: (index: number) => void;
  isSubmitting: boolean;
}

const LinkedAccountsSection: React.FC<LinkedAccountsSectionProps> = ({
  accounts,
  onAddAccount,
  onUnlinkAccount,
  isSubmitting
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Linked Accounts</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onAddAccount}
          className="text-primary hover:text-primary/90"
        >
          + Add Account
        </Button>
      </div>
      
      {accounts.map((account, index) => (
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onUnlinkAccount(index)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlink'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkedAccountsSection;
