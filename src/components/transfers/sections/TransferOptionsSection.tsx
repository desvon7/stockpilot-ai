
import React from 'react';
import { ChevronRight, ArrowRight, Upload, RefreshCw, Building } from 'lucide-react';

interface TransferOptionsSectionProps {
  depositModalTrigger?: React.ReactNode;
}

const TransferOptionsSection: React.FC<TransferOptionsSectionProps> = ({ 
  depositModalTrigger 
}) => {
  return (
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
      
      {depositModalTrigger || (
        <div className="flex gap-4 border-b border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded">
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
      )}
      
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
  );
};

export default TransferOptionsSection;
