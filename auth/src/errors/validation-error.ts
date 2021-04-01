import { CustomError } from "./custom-error";
import { Result, ValidationError } from "express-validator";
import { ValidationErrorSerialzer } from "./serializers/validation-error-serializer";
import { ErrorSerializer } from "./serializers/error-serializer";

export class InputValidationError extends CustomError {
  validationErrors: Result<ValidationError>;
  es: ErrorSerializer;
  statusCode = 400;

  constructor(validationErrors: Result<ValidationError>) {
    super();
    Object.setPrototypeOf(this, CustomError.prototype);
    this.validationErrors = validationErrors;
    // TODO (maybe) : Have a setter that uses some sort of factory to avoid having unecssary dependencies on concretions
    this.es = new ValidationErrorSerialzer(this.validationErrors);
  }
}
