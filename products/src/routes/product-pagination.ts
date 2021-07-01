import express, { Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import { sortMethods } from "../repos/sort-methods";
import { StatusCodes } from "./helpers/status-codes";
import { client } from "../client";
import { categories } from "../models/categories-model";

// create a router for the GET "/api/v1/products" route
let router = express.Router();

// custom validator for white listing the sortMethod query parameter
function validateSortMethod(method: string): Promise<string> {
  // check if sortMethod matches at least one possible sort methods in the whitelist
  if (
    method == sortMethods.DATE ||
    method == sortMethods.PRICE_LOW_TO_HIGH ||
    method == sortMethods.TEXT
  ) {
    return Promise.resolve("Valid sort method");
  }

  return Promise.reject("Not a valid sort method");
}

// make the router activate on the "/api/v1/products" route & define the request and response
router.get(
  "/api/products",
  [
    // sortMethod needs to be defined and valid - sorting options are: price, text, date; text is the default
    query("sortMethod").custom(validateSortMethod),
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

      // query is invalid send an error
      return Promise.reject(
        "If query is provided it cannot be an empty string"
      );
    }),
    //  sortKey needs to be defined for price, text, and date and be valid in those instances
    //  TODO: Refactor as part of last red-green-refactor step to remove duplication and allow for additional sortMethods to be validated.
    //       I would go about this by creating a Validator interface with validators for each sortMethod-sortKey combo.
    //       Then I would create a Validation class with a factory method to choose the validator by the sortMethod. This validator would get its validation
    //       work delegated to it in a 'validateSortKey' method in the Validation class.
    query(["sortKey"]).custom(async (key, fields) => {
      // get the sortMethod value
      let sortMethod = fields.req.query!["sortMethod"];

      // validate the sort method
      try {
        await validateSortMethod(sortMethod);
      } catch (e) {
        return Promise.reject(e);
      }

      // check if key is defined
      if (key === undefined) {
        return Promise.reject("The sort key needs to be defined");
      }

      // convert key into a number
      let keyToNumber = Number(key);

      // check if sortKey is a valid number or undefined
      if (isNaN(keyToNumber)) {
        return Promise.reject(
          "The sort key needs to be a number when searching by price or text"
        );
      }

      return Promise.resolve();
    }),
    // category needs to be defined and valid - when a user wants to search for a product without specifying category, we use "All"
    query("category").custom(async (category) => {
      console.log(category);
      let categoriesCollection = client.getCollection("categories");
      let categories = await categoriesCollection!.find({}).toArray();

      console.log(categories);

      if (categories.length > 0) {
        return Promise.resolve("Valid category");
      }

      return Promise.reject("Invalid category");
    }),
  ],
  async (req: Request, res: Response) => {
    //  validate the request query parameters

    //  check if validation failed
    const errors = validationResult(req).array();
    // if (errors.length > 0) console.log(errors);

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
