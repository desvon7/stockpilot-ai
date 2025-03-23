
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormValues } from '@/hooks/useOrderForm';

interface OrderTypeFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

const OrderTypeField: React.FC<OrderTypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
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
