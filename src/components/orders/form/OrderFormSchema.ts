
import * as z from 'zod';

// Form schema with validation
export const orderFormSchema = z.object({
  orderType: z.enum(['buy', 'sell']),
  shares: z.string()
    .refine(val => !isNaN(Number(val)), { message: 'Must be a valid number' })
    .refine(val => Number(val) > 0, { message: 'Must be greater than 0' }),
  executionType: z.enum(['market', 'limit']),
  limitPrice: z.string().optional()
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
