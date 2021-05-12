import { Collection, ObjectId } from "mongodb";
import { client } from "../../../client";
import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../../test/setup";
import { dbConfig } from "../../../config/database-config";
import { ProductModel } from "../../../models/product-model";
import { PaginationStrategy } from "../pagination-strategy-base";
import { PaginationOptions } from "../../helpers/pagination-options";
import { sortMethods } from "../../../repos/sort-methods";
import { categories } from "../../../models/categories-model";
import { TextPreviousPage } from "../text-previous-page";

// Things to be tested:
// 1. Potential query situations for paging to the previous page:
//  Query with a brand, keywords, and across all categories                         []
//  Query by brand and a specific category                                          []
//  Query by category and no brand with keywords                                    []

// 2. Other general things:
//  Ensure the pagination handles ties                                              []
//  Ensure the pagination handles products with multiple categories correctly       []

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

it("Returns a specific brand's products with a lesser text weight than provided across all categories given a brand and keywords", async () => {});

it("Returns a specific brand's products with a lesser text weight than provided in a single category given a particular brand, category, and keywords", async () => {});

it("Returns products with a lesser text weight than provided across all brands in a specific category given keywords", async () => {});

it("Handles ties in text weight when returning products on the previous page of results ", async () => {});

it("Returns products with a lesser text weight than provided across all brands that have multiple categories - and one that matches the desired category - sorted by text relevancy", async () => {});
