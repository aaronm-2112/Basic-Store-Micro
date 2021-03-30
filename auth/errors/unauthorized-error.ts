export class UnauthorizedError extends Error {
  constructor(msg: string) {
    super();
    this.message = msg;
  }

  statusCode = 401;
}
