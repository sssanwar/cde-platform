export class InputError extends Error {
  constructor(
    readonly message: string,
    readonly statusCode = 400,
  ) {
    super(message)
  }
}
