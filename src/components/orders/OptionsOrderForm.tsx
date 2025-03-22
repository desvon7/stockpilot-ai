
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  DollarSign, 
  ArrowDownUp,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addMonths } from 'date-fns';

// Form schema with validation
const optionsFormSchema = z.object({
  orderType: z.enum(['buy', 'sell']),
  optionType: z.enum(['call', 'put']),
  contracts: z.string()
    .refine(val => !isNaN(Number(val)), { message: 'Must be a valid number' })
    .refine(val => Number(val) > 0, { message: 'Must be greater than 0' }),
  strikePrice: z.string()
    .refine(val => !isNaN(Number(val)), { message: 'Must be a valid number' })
    .refine(val => Number(val) > 0, { message: 'Must be greater than 0' }),
  expirationDate: z.string(),
  limitPrice: z.string()
    .refine(val => !isNaN(Number(val)), { message: 'Must be a valid number' })
    .refine(val => Number(val) > 0, { message: 'Must be greater than 0' }),
});

export type OptionsFormValues = z.infer<typeof optionsFormSchema>;

interface OptionsOrderFormProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  onOrderSuccess?: () => void;
}

const OptionsOrderForm: React.FC<OptionsOrderFormProps> = ({ 
  symbol, 
  companyName,
  currentPrice,
  onOrderSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate expiration dates (3rd Friday of next 4 months)
  const getExpirationDates = () => {
    const dates = [];
    const now = new Date();
    
    for (let i = 0; i < 4; i++) {
      const d = addMonths(now, i);
      d.setDate(1);
      
      // Find the first Friday
      while (d.getDay() !== 5) {
        d.setDate(d.getDate() + 1);
      }
      
      // Go to the third Friday
      d.setDate(d.getDate() + 14);
      
      dates.push({
        value: format(d, 'yyyy-MM-dd'),
        label: format(d, 'MMM d, yyyy')
      });
    }
    
    return dates;
  };

  const expirationDates = getExpirationDates();

  // Initialize form
  const form = useForm<OptionsFormValues>({
    resolver: zodResolver(optionsFormSchema),
    defaultValues: {
      orderType: 'buy',
      optionType: 'call',
      contracts: '1',
      strikePrice: Math.round(currentPrice).toString(),
      expirationDate: expirationDates[0].value,
      limitPrice: '1.50',
    }
  });

  const orderType = form.watch('orderType');
  const optionType = form.watch('optionType');
  const contracts = form.watch('contracts');
  const limitPrice = form.watch('limitPrice');
  
  // Calculate estimated total (each contract represents 100 shares)
  const contractsNum = Number(contracts) || 0;
  const limitPriceNum = Number(limitPrice) || 0;
  const estimatedTotal = contractsNum * limitPriceNum * 100;

  // Handle form submission
  const onSubmit = async (values: OptionsFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Order to ${values.orderType} ${values.contracts} ${symbol} ${values.optionType} options was submitted!`);
      
      // Reset form to default values
      form.reset({
        orderType: 'buy',
        optionType: 'call',
        contracts: '1',
        strikePrice: Math.round(currentPrice).toString(),
        expirationDate: expirationDates[0].value,
        limitPrice: '1.50',
      });
      
      // Callback for refreshing data
      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (error) {
      console.error('Options order submission error:', error);
      toast.error(`Failed to execute order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade {symbol} Options</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Stock Price:</span>
              <span className="font-bold">
                ${currentPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'Loading...'}
              </span>
            </div>
            
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
                      <SelectItem value="buy">Buy to Open</SelectItem>
                      <SelectItem value="sell">Sell to Close</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="optionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Option Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="put">Put</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select Expiration Date" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expirationDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="strikePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strike Price</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter strike price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contracts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Contracts</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter number of contracts"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="limitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limit Price ($ per share)</FormLabel>
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
            
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-sm font-medium">Estimated Total:</span>
              <span className="font-bold">
                ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <Button 
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : orderType === 'buy' ? (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Buy {contracts} {optionType === 'call' ? 'Call' : 'Put'} Contracts
                </>
              ) : (
                <>
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  Sell {contracts} {optionType === 'call' ? 'Call' : 'Put'} Contracts
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col text-xs text-muted-foreground">
        <div className="flex items-start">
          <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
          <p>Options trading involves significant risk and is not suitable for all investors. Each contract represents 100 shares.</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OptionsOrderForm;
