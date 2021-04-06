import { ErrorSerializer } from "./error-serializer";
import { Result, ValidationError } from "express-validator";

export class ValidationErrorSerialzer extends ErrorSerializer {
  errors: Result<ValidationError>;

  constructor(errors: Result<ValidationError>) {
    super();
    this.errors = errors;
  }

  serializeErrors() {
    // iterate through the ValidationErrors object and return the messages in the shape of the errorformat interface
    let errorMessages = this.errors.array().map((error) => {
      return { msg: error.msg };
    });

    return errorMessages;
  }
}
