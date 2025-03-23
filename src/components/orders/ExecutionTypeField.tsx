
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { OrderFormValues } from '@/hooks/useOrderForm';

interface ExecutionTypeFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

const ExecutionTypeField: React.FC<ExecutionTypeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="executionType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Execution Type</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Execution Type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="market">Market Order</SelectItem>
              <SelectItem value="limit">Limit Order</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExecutionTypeField;
