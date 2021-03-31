export abstract class CustomError extends Error {
  constructor(msg: string) {
    super();
    this.message = msg;
    Object.setPrototypeOf(this, Error.prototype);
  }

  abstract statusCode: number;
}
