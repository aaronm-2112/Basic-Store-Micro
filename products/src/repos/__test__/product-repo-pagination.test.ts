// purpose: Test the factory method in the product reposiotory's derived class

import { ObjectId } from "bson";
import { dbConfig } from "../../config/database-config";
import { categories } from "../../models/categories-model";
import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../test/setup";
import { PaginationOptions } from "../../pagination/helpers/pagination-options";
import { PriceNextPage } from "../../pagination/pagination-strategies/price-next-page";
import { PricePreviousPage } from "../../pagination/pagination-strategies/price-previous-page";
import { TextNextPage } from "../../pagination/pagination-strategies/text-next-page";
import { TextPreviousPage } from "../../pagination/pagination-strategies/text-previous-page";
import { ProductsRepo } from "../products-repo-base";
import { ProductsRepoPagination } from "../products-repo-pagination";
import { sortMethods } from "../sort-methods";

let productRepoPagination: ProductsRepo;

beforeAll(async () => {
  await connectToTestDatabase(dbConfig.databaseName);
  await runMigrationsOnTestDatabase();
  productRepoPagination = new ProductsRepoPagination();
});

it("Returns the text based pagination strategy for moving to the next page", () => {
  // create the pagination options object
  let options: PaginationOptions = {
    // set the sortMethod to text
    sortMethod: sortMethods.TEXT,
    // page to next
    page: "next",
    // fill out the rest of the fields with dummy data
    sortKey: 1,
    uniqueKey: new ObjectId(123),
    categories: categories.FOOTWEAR,
    query: "",
  };

  // call the factory method
  let strategy = productRepoPagination.createPaginationStrategy(options);

  // test that the returned object is the TextNextPage strategy object
  expect(strategy).toBeInstanceOf(TextNextPage);
});

it("Returns the text based pagination strategy for moving to the previous page", () => {
  // create the pagination options object
  let options: PaginationOptions = {
    // set the sortMethod to text
    sortMethod: sortMethods.TEXT,
    // page to next
    page: "previous",
    // fill out the rest of the fields with dummy data
    sortKey: 1,
    uniqueKey: new ObjectId(123),
    categories: categories.FOOTWEAR,
    query: "",
  };

  // call the factory method
  let strategy = productRepoPagination.createPaginationStrategy(options);

  // test that the returned object is the TextPreviousPage strategy object
  expect(strategy).toBeInstanceOf(TextPreviousPage);
});

it("Returns the price based pagination strategy for moving to the next page", () => {
  // create the pagination options object
  let options: PaginationOptions = {
    // set the sortMethod to text
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    // page to next
    page: "next",
    // fill out the rest of the fields with dummy data
    sortKey: 1,
    uniqueKey: new ObjectId(123),
    categories: categories.FOOTWEAR,
    query: "",
  };

  // call the factory method
  let strategy = productRepoPagination.createPaginationStrategy(options);

  // test that the returned object is the TextPreviousPage strategy object
  expect(strategy).toBeInstanceOf(PriceNextPage);
});

it("Returns price based pagination stratgey for moving to the previous page", () => {
  // create the pagination options object
  let options: PaginationOptions = {
    // set the sortMethod to text
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    // page to next
    page: "previous",
    // fill out the rest of the fields with dummy data
    sortKey: 1,
    uniqueKey: new ObjectId(123),
    categories: categories.FOOTWEAR,
    query: "",
  };

  // call the factory method
  let strategy = productRepoPagination.createPaginationStrategy(options);

  // test that the returned object is the TextPreviousPage strategy object
  expect(strategy).toBeInstanceOf(PricePreviousPage);
});

it("Throws an error if given an invalid pagination options object", () => {
  // create the pagination options object
  let options: PaginationOptions = {
    // set the sortMethod to text
    sortMethod: sortMethods.PRICE_HIGH_TO_LOW,
    // page to next
    page: "previous",
    // fill out the rest of the fields with dummy data
    sortKey: 1,
    uniqueKey: new ObjectId(123),
    categories: categories.FOOTWEAR,
    query: "",
  };

  expect(() => {
    productRepoPagination.createPaginationStrategy(options);
  }).toThrow("Not a valid pagination stratgey");
});
