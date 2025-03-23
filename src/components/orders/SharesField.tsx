
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormValues } from '@/hooks/useOrderForm';

interface SharesFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

const SharesField: React.FC<SharesFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
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
