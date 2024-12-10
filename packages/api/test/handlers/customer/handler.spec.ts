import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { mock } from 'jest-mock-extended'
import customers from '../../../src/data/customers.json'
import { CustomerHandler } from '../../../src/handlers/customer/handler'

describe('handlers/customer/handler', () => {
  const handler = CustomerHandler({ customers })
  const mockEvent = mock<APIGatewayProxyEventV2>()
  const query = { dir: 'asc', size: '20', page: '1', field: 'id' }

  beforeAll(() => {
    mockEvent.queryStringParameters = undefined
  })

  it('uses default values for query string parameters', async () => {
    const res = await handler(mockEvent)
    const body = JSON.parse(res.body || '')
    expect(body.data.length).toEqual(20)
  })

  it('handles query string input errors', async () => {
    mockEvent.queryStringParameters = { ...query, field: 'abc' }
    const res = await handler(mockEvent)
    const body = JSON.parse(res.body || '')
    expect(body.message).toMatch('Invalid enum value')
  })

  it('handles multiple query string input errors', async () => {
    mockEvent.queryStringParameters = { ...query, field: 'abc', page: 'abc' }
    const res = await handler(mockEvent)
    const body = JSON.parse(res.body || '')
    expect(body.messages[0]).toMatch('Expected number')
    expect(body.messages[1]).toMatch('Invalid enum')
  })
})
