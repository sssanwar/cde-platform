import { Customer } from '../model/customer'
import { CustomerPagingOptions } from '../model/paging'
import { Paginator, PagingResult } from '../utils/paginator'

export type DataSource = {
  customers: Customer[]
}

export type CustomerService = {
  getPagedData: (options: CustomerPagingOptions) => Promise<PagingResult<Customer>>
}

export const CustomerService = (ds: DataSource): CustomerService => {
  const customersPaginator = Paginator(ds.customers)

  return {
    getPagedData: async (options: CustomerPagingOptions) => customersPaginator(options),
  }
}
