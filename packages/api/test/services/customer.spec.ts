import customerData from '../../src/data/customers.json'
import { Customer } from '../../src/model/customer'
import { CustomerPagingOptions } from '../../src/model/paging'
import { CustomerService } from '../../src/services/customer'

describe('services/customer', () => {
  const customers: Customer[] = customerData
  const service = CustomerService({ customers })
  const pagingOpts: CustomerPagingOptions = { page: 1, size: 20, dir: 'asc', field: 'name' }

  it('returns paged data', async () => {
    const res = await service.getPagedData(pagingOpts)
    expect(res.total).toBe(200)
    expect(res.data.length).toBe(20)
    res.data.forEach(cust => expect(cust.name.match(/^[AB]/)).toBeTruthy()) // expect sorted names
  })

  it('sorts descendingly', async () => {
    const res = await service.getPagedData({ ...pagingOpts, dir: 'desc' })
    expect(res.total).toBe(200)
    expect(res.data.length).toBe(20)
    res.data.forEach(cust => expect(cust.name.match(/^[WVT]/)).toBeTruthy()) // expect sorted names
  })

  it('sorts by date', async () => {
    const res = await service.getPagedData({ ...pagingOpts, field: 'registered' })
    expect(res.total).toBe(200)
    expect(res.data.length).toBe(20)
    res.data.forEach(cust => expect(cust.registered.match(/^(2014|2015)/)).toBeTruthy()) // expect sorted names
  })

  it('throws for invalid paging options', async () => {
    await expect(service.getPagedData({ ...pagingOpts, page: 10 })).resolves.toHaveProperty('total', 200)
    await expect(service.getPagedData({ ...pagingOpts, page: 11 })).rejects.toThrow('Page number exceeds')
  })
})
