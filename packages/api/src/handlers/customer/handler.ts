import { CustomerPagingOptions } from '../../model/paging'
import { CustomerService, DataSource } from '../../services/customer'
import { withCatch } from '../../utils/middleware'
import { Response } from '../../utils/response'

export const CustomerHandler = (ds: DataSource) => {
  const service = CustomerService(ds)

  return withCatch(async event => {
    const opts = CustomerPagingOptions.parse({
      field: event.queryStringParameters?.field ?? 'id',
      dir: event.queryStringParameters?.dir ?? 'asc',
      page: Number(event.queryStringParameters?.page ?? 1),
      size: Number(event.queryStringParameters?.size ?? 20),
    })

    const res = await service.getPagedData(opts)
    return Response.ok(res)
  })
}
