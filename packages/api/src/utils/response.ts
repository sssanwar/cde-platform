import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { Serializable } from './types'

export namespace Response {
  export const toResponse = (statusCode: number, data: Serializable): APIGatewayProxyStructuredResultV2 => {
    return {
      statusCode: statusCode,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: data ? JSON.stringify(typeof data === 'string' ? { message: data } : data) : undefined,
    }
  }

  export const ok = (data: Serializable) => toResponse(200, data)
  export const error = (data: Serializable) => toResponse(500, data)
}
