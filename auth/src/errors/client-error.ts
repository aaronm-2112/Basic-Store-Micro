import { CustomError } from "./custom-error";
import { ErrorSerializer } from "./serializers/error-serializer";
import { SingleErrorSerializer } from "./serializers/single-error-serializer";

export class ClientError extends CustomError {
  es: ErrorSerializer;
  statusCode = 400;

  constructor(msg: string) {
    super();
    Object.setPrototypeOf(this, CustomError.prototype);
    this.es = new SingleErrorSerializer(msg);
  }
}
