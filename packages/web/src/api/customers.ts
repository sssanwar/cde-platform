import { Customer } from '@cde-platform/api/lib/model/customer'
import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { PagingResult } from '@cde-platform/api/lib/utils/paginator'
import { toQueryString } from './utils'

export const CustomersApi = (baseUrl: string) => {
  const customersUrl = `${baseUrl}/v1/customers`

  return {
    getPagedData: async (paging?: Partial<CustomerPagingOptions>): Promise<PagingResult<Customer>> => {
      let url = customersUrl + toQueryString(paging)
      const res = await fetch(url)
      const body = (await res.json()) as any
      if (res.status !== 200) {
        throw new Error(body.message ?? body.messages.join('; '))
      }

      return body
    },
  }
}
