import { ErrorSerializer } from "./serializers/error-serializer";

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract es: ErrorSerializer;

  constructor(msg?: string) {
    super(msg || "");
    Object.setPrototypeOf(this, Error.prototype);
  }

  serializeErrors() {
    return this.es.serializeErrors();
  }
}
