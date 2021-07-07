import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import {
  validateSortMethod,
  validatePage,
  validateUniqueKey,
  validateQuery,
  validateSortKey,
  validateCategory,
} from "./helpers/validation";
import { StatusCodes } from "./helpers/status-codes";
import { client } from "../client";

// create a router for the GET `"/api/v1/products" route
let router = express.Router();

// make the router activate on the "/api/v1/products" route & define the request and response
router.get(
  "/api/products",
  [
    // sortMethod needs to be defined and valid - sorting options are: price, text, date; text is the default
    query("sortMethod").custom(validateSortMethod),
    // page needs to be defined and valid. Valid values are "next" and "previous"
    query("page").custom(validatePage),
    // uniqueKey needs to be defined and a valid mongodb objectID
    query("uniqueKey").custom(validateUniqueKey),
    // query parameter can be undefined. If it isn't undefined it cannot be an empty string.
    query("query").custom(validateQuery),
    //  sortKey needs to be defined for price, text, and date and be valid in those instances

    query(["sortKey"]).custom(validateSortKey),
    // category needs to be defined and valid - when a user wants to search for a product without specifying category, we use "All"
    query("category").custom(validateCategory),
  ],
  async (req: Request, res: Response) => {
    //  check for validation errors
    const errors = validationResult(req).array();

    if (errors.length) {
      //     throw a client error -- this will be caught by the common error handler
      return res.sendStatus(StatusCodes.CLIENT_ERROR);
    }
    //  scan the query string
    //      for each word check if it is a verified brand
    //          if so remove that word from the query and place in a brand variable
    //  create the product pagination options struct
    //      pass in the query parameters and the brand variable if applicable
    //  create the product repository
    //  call the paginate method on the product repository with the pagination options struct
    //  return the product results to the client
    return res.sendStatus(StatusCodes.OK);
  }
);

export { router as paginationRouter };
