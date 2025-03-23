
import React from 'react';
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { PlusIcon } from '../icons/TransferIcons';

interface BankTabContentProps {
  onConnectBank: () => void;
  isProcessing: boolean;
  linkToken: string | null;
}

const BankTabContent: React.FC<BankTabContentProps> = ({ 
  onConnectBank, 
  isProcessing, 
  linkToken 
}) => {
  return (
    <TabsContent value="bank" className="mt-2">
      <Button 
        onClick={onConnectBank}
        className="w-full"
        disabled={isProcessing || !linkToken}
      >
        <PlusIcon />
        Connect Bank Account
      </Button>
    </TabsContent>
  );
};

export default BankTabContent;
