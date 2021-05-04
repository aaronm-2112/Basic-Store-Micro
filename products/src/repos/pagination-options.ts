// purpose: Store the pagination options

import { ObjectId } from "mongodb";
import { categories } from "../models/categories-model";
import { sortMethods } from "./sort-methods";

export interface PaginationOptions {
  // create a category that is a value of an enumerated type called Categories
  categories: categories;
  // create a sortMethod that has to be one value of the SorthMethods enumerated type
  sortMethod: sortMethods;
  // create a sortKey that is a string, for sorting by price, or Date for sorting by date
  sortKey: string | Date | number;
  // create a query that is a string
  query: string;
  // create a page that is a string
  page: string;
  // create a uniqueKey that is a ObjectID or string
  uniqueKey: ObjectId;
  // create an optional brand that is a string
  brand?: string;
}
