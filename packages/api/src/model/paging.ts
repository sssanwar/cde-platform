import { z } from 'zod'
import { Customer } from './customer'

export const PagingOptions = z.object({
  dir: z.enum(['asc', 'desc']),
  page: z.number().min(1),
  size: z.number().min(5).max(50),
})

export type PagingOptions = z.infer<typeof PagingOptions>

export const CustomerPagingOptions = PagingOptions.extend({
  field: Customer.keyof(),
})

export type CustomerPagingOptions = z.infer<typeof CustomerPagingOptions>
