import { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/validation-error";
import { validationResult } from "express-validator";

export function validateInput(req: Request, res: Response, next: NextFunction) {
  // check if validation passes
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //  if not send back a 400
    errors.array().forEach((element) => {
      console.error(element);
    }); // changes listen

    throw new InputValidationError(errors);
  }

  next();
}
