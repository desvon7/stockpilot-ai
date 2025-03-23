
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormValues } from '@/hooks/useOrderForm';

interface LimitPriceFieldProps {
  form: UseFormReturn<OrderFormValues>;
  show: boolean;
}

const LimitPriceField: React.FC<LimitPriceFieldProps> = ({ form, show }) => {
  if (!show) return null;
  
  return (
    <FormField
      control={form.control}
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
