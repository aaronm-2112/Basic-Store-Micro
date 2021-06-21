import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import { sortMethods } from "../repos/sort-methods";
import { StatusCodes } from "./helpers/status-codes";

// create a router for the GET "/api/v1/products" route
let router = express.Router();

// make the router activate on the "/api/v1/products" route & define the request and response
router.get(
  "/api/products",
  [
    // sortMethod needs to be defined and valid - sorting options are: price, text, date; text is the default
    query("sortMethod").custom((sortMethod) => {
      // check if sortMethod matches at least one possible sort methods in the whitelist
      if (
        sortMethod == sortMethods.DATE ||
        sortMethod == sortMethods.PRICE_LOW_TO_HIGH ||
        sortMethod == sortMethods.TEXT
      ) {
        return Promise.resolve("Valid value");
      }

      return Promise.reject("Not a valid sort method");
    }),
    // page needs to be defined and valid. Valid values are "next" and "previous"
    query("page").custom((page) => {
      // check that page matches the whitelist of page values
      if (page == "next" || page == "previous") {
        return Promise.resolve("Valid value");
      }

      return Promise.reject("Not a valid page value");
    }),
    // uniqueKey needs to be defined and a valid mongodb objectID
    query("uniqueKey").custom((key) => {
      // cast the key into an objectId
      let objectId = new ObjectId(key);

      // check that the objectId's value matches the key
      // IMP: Casting a valid ObjectId hex string into an Object Id results in an ObjectId object containing the same value as the given key
      if (objectId.equals(key)) {
        return Promise.resolve();
      }

      return Promise.reject();
    }),
    // query parameter can be undefined. If it isn't undefined it cannot be an empty string.
    query("query").custom((query) => {
      // check if query is undefined
      if (query === undefined) {
        // pass validation
        return Promise.resolve();
      }

      // query is defined so check that query is not an empty string
      if (query.length > 0) {
        return Promise.resolve();
      }

      return Promise.reject(
        "If query is provided it cannot be an empty string"
      );
    }),
    // sortKey can be undefined when performing a sort by text. sortKey needs to be defined for price and date and be valid in those instances
    query("sortKey").custom((key) => {}),
  ],
  async (req: Request, res: Response) => {
    //  validate the request query parameters
    //      category needs to be defined and valid - when a user wants to search for a product without specifying category, we use "All"

    //  check if validation failed
    const errors = validationResult(req).array();
    console.log(errors);

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
    res.sendStatus(StatusCodes.OK);
  }
);

export { router as paginationRouter };
