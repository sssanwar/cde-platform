import { z } from 'zod'

export const Customer = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  registered: z.string().datetime(),
})

export type Customer = z.infer<typeof Customer>
