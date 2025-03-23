
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { OrderFormValues } from './OrderFormSchema';

interface SharesFieldProps {
  control: Control<OrderFormValues>;
}

const SharesField: React.FC<SharesFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="shares"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Number of Shares</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              type="text"
              inputMode="decimal"
              placeholder="Enter shares amount"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SharesField;
