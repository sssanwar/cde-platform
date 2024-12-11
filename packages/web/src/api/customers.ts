import { Customer } from '@cde-platform/api/lib/model/customer'
import { CustomerPagingOptions } from '@cde-platform/api/lib/model/paging'
import { PagingResult } from '@cde-platform/api/lib/utils/paginator'
import { toQueryString } from './utils'

export const CustomersApi = (baseUrl: string) => {
  const customersUrl = `${baseUrl}/v1/customers`
  const pagedDataCache: Record<string, PagingResult<Customer>> = {}

  return {
    getPagedData: async (paging?: Partial<CustomerPagingOptions>): Promise<PagingResult<Customer>> => {
      const queryString = toQueryString(paging)

      if (!pagedDataCache[queryString]) {
        let url = customersUrl + queryString
        const res = await fetch(url)
        const body = (await res.json()) as any
        if (res.status !== 200) {
          throw new Error(body.message ?? body.messages.join('; '))
        }
        pagedDataCache[queryString] = body
      }

      return pagedDataCache[queryString]
    },
  }
}
