
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormValues } from '@/hooks/useOrderForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface SharesFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

const SharesField: React.FC<SharesFieldProps> = ({ form }) => {
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={form.control}
      name="shares"
      render={({ field }) => (
        <FormItem className={isMobile ? 'mb-2' : ''}>
          <FormLabel className="flex items-center justify-between">
            <span>Number of Shares</span>
            {!isMobile && (
              <span className="text-xs text-muted-foreground">Enter quantity</span>
            )}
          </FormLabel>
          <FormControl>
            <Input 
              {...field} 
              type="text"
              inputMode="decimal"
              placeholder="Enter shares amount"
              className="font-medium"
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export default React.memo(SharesField);
