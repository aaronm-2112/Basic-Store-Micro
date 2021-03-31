import { CustomError } from "./custom-error";

export class ClientError extends CustomError {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  statusCode = 400;
}
