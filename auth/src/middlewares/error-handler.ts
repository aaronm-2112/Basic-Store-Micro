import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // internale logging -- in a basic form
  console.error(err.message);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  } else {
    return res.status(500).send({ error: err.message });
  }
}
