import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("In the error handler");
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.message });
  } else {
    return res.send({ error: "Something went wrong with the request" });
  }
}
