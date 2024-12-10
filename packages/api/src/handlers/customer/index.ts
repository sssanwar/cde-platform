import { CustomerHandler } from './handler'
import customers from '../../data/customers.json'

export const handler = CustomerHandler({ customers })
