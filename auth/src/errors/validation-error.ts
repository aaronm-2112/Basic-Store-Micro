import { CustomError } from "./custom-error";

export class ValidationError extends CustomError {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  statusCode = 400;
}
