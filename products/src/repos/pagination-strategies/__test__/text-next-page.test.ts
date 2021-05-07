// Purpose: Test paginating to the 'next' page when sorting by text relevance

import { Collection, ObjectId } from "mongodb";
import { client } from "../../../client";
import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../../test/setup";
import { dbConfig } from "../../../config/database-config";
import { ProductModel } from "../../../models/product-model";
import { PaginationStrategy } from "../pagination-strategy-base";
import { PaginationOptions } from "../../pagination-options";
import { sortMethods } from "../../sort-methods";
import { categories } from "../../../models/categories-model";
import { TextNextPage } from "../text-next-page";

// Things to be tested:
// 1. Potential query situations for paging to the previous page:
//  Query with a brand, keywords, and across all categories                     []
//  Query by brand and a specific category                                      []
//  Query by category and no brand with keywords                                []
//  Query by a category with no brand and no keywords                           []

// 2. Other general things:
//  Ensure the pagination returns 0 results on empty database                   []
//  Ensure the pagination handles ties                                          []
//  Ensure the pagination handles products with multiple categories correctly   []
//  Ensure the pagination returns the next set of results given a unique key    []

// a collection object used in the strategies
let productsCollection: Collection<any> | undefined;

beforeAll(async () => {
  // connect to the test database
  await connectToTestDatabase(dbConfig.databaseName);
  // setup the database
  await runMigrationsOnTestDatabase();
  // connect the collection object to the test products-micro collection "products"
  productsCollection = client.getCollection("products");
});

it("Returns a specific brand's products across all categories given a brand and keywords", async () => {});

it("Returns a specific brand's products in a single category given a particular brand, category, and keywords", async () => {});

it("Returns products across all brands in a specific category given keywords", async () => {});

it("Returns all products in a given category when not given keywords or brands", async () => {});

it("Returns 0 products when searching for products in an empty database", async () => {});

it("", async () => {});
