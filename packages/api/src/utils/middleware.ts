import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import { ZodError } from 'zod'
import { Response } from './response'

type Handler = (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyStructuredResultV2>

const extractZodError = (zodError: ZodError) => {
  return zodError.issues.length === 1
    ? { message: zodError.issues[0].message }
    : { messages: zodError.issues.map(issue => issue.message) }
}

export const withCatch = (handler: Handler): Handler => {
  return async (...params: Parameters<Handler>) => {
    try {
      const res = await handler(...params)
      return res
    } catch (error: any) {
      return Response.error(error instanceof ZodError ? extractZodError(error) : error.message)
    }
  }
}
