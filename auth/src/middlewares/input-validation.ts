import { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/validation-error";
import { validationResult } from "express-validator";

export function validateInput(req: Request, res: Response, next: NextFunction) {
  // check if validation passes
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new InputValidationError(errors);
  }

  next();
}
