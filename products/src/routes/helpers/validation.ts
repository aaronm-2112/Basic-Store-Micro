// purpose: Validation functions for query parameters, body parameters, etc
import { sortMethods } from "../../repos/sort-methods";
import { ObjectId } from "mongodb";
import { Meta } from "express-validator";
import { client } from "../../client";

export function validateSortMethod(method: string): Promise<string> {
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

export function validatePage(page: string): Promise<string> {
  // check that page matches the whitelist of page values
  if (page == "next" || page == "previous") {
    return Promise.resolve("Valid value");
  }

  return Promise.reject("Not a valid page value");
}

export function validateUniqueKey(key: any): Promise<void> {
  // cast the key into an objectId
  let objectId = new ObjectId(key);

  // check that the objectId's value matches the key
  // IMP: Casting a valid ObjectId hex string into an Object Id results in an ObjectId object containing the same value as the given key
  if (objectId.equals(key)) {
    return Promise.resolve();
  }

  return Promise.reject();
}

export function validateQuery(query: string): Promise<string> {
  // check if query is undefined
  if (query === undefined) {
    // pass validation
    return Promise.resolve("No query provided");
  }

  // query is defined so check that query is not an empty string
  if (query.length > 0) {
    return Promise.resolve("Empty query not searchable");
  }

  // query is invalid send an error
  return Promise.reject("If query is provided it cannot be an empty string");
}

//  TODO: Refactor as part of last red-green-refactor step to remove duplication and allow for additional sortMethods to be validated.
//       I would go about this by creating a Validator interface with validators for each sortMethod-sortKey combo.
//       Then I would create a Validation class with a factory method to choose the validator by the sortMethod. This validator would get its validation
//       work delegated to it in a 'validateSortKey' method in the Validation class.
export async function validateSortKey(key: any, fields: Meta): Promise<string> {
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

  return Promise.resolve("Valid sort key");
}

export async function validateCategory(category: string): Promise<string> {
  // get the categories using the database client
  let categoriesCollection = client.getCollection("categories");

  // return the matching category from the categories collection
  let categories = await categoriesCollection!
    .find({ category: category })
    .toArray();

  // if there is no match found throw an error
  if (!categories.length) {
    return Promise.reject("Invalid category");
  }

  // resolve since the user client sent a valid category
  return Promise.resolve("Valid category");
}
