
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

interface LimitPriceFieldProps {
  control: Control<OrderFormValues>;
  show: boolean;
}

const LimitPriceField: React.FC<LimitPriceFieldProps> = ({ control, show }) => {
  if (!show) return null;
  
  return (
    <FormField
      control={control}
      name="limitPrice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Limit Price</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              type="text"
              inputMode="decimal"
              placeholder="Enter limit price"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LimitPriceField;
