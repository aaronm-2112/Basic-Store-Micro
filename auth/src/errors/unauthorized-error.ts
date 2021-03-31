import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  statusCode = 401;
}
