import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { StatusCodes } from "./helpers/status-codes";

// create a router for the GET "/api/v1/products" route
let router = express.Router();

// make the router activate on the "/api/v1/products" route & define the request and response
router.get(
  "/api/products",
  [query("sortMethod").notEmpty().isInt()],
  async (req: Request, res: Response) => {
    //  validate the request query parameters
    //      category needs to be defined and valid - when a user wants to search for a product without specifying category, we use "All"
    //      query parameter can be undefined. If it isn't undefined it cannot be an empty string.
    //      sortMethod needs to be defined and valid - sorting options are: price, text, date; text is the default
    //      sortKey can be undefined when performing a sort by text. sortKey needs to be defined for price and date and valid.
    //      page needs to be defined and valid. Valid values are "next" and "previous"
    //      uniqueKey needs to be defined and a valid mongodb objectID
    //  check if validation failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
    res.sendStatus(200);
  }
);

export { router as paginationRouter };
