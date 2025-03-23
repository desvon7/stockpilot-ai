
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { OrderFormValues } from './OrderFormSchema';

interface OrderTypeFieldProps {
  control: Control<OrderFormValues>;
}

const OrderTypeField: React.FC<OrderTypeFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="orderType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Order Type</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Order Type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OrderTypeField;
