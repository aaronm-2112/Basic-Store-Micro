// Purpose: Test paginating to the 'next' page when sorthing by price

import { Collection, ObjectId } from "mongodb";
import { client } from "../../../client";
import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../../test/setup";
import { dbConfig } from "../../../config/database-config";
import { ProductModel } from "../../../models/product-model";
import { PriceNextPage } from "../price-next-page";
import { PaginationStrategy } from "../pagination-strategy-base";
import { PaginationOptions } from "../../pagination-options";
import { sortMethods } from "../../sort-methods";
import { categories } from "../../../models/categories-model";

// a collection object used in the strategies
let productsCollection: Collection<any> | undefined;

let pm: ProductModel = {
  name: "Gusher",
  brand: "Fruity",
  category: ["Fresh Foods"],
  price: 10.0,
  description: "Friuity and elicious",
  imageURI: "/image",
  quantity: 12,
  user: {
    username: "Woo Woo",
    email: "woO@mail.com",
  },
};

beforeAll(async () => {
  // connect to the test database
  await connectToTestDatabase(dbConfig.databaseName);
  // setup the database
  await runMigrationsOnTestDatabase();
  // connect the collection object to the test products-micro collection "products"
  productsCollection = client.getCollection("products");
});

it("Gets a price of 0 and retrieves the first page of products sorted by price from low to high", async () => {
  // insert products into the collection
  await productsCollection?.insertMany([
    {
      name: "Gusher",
      brand: "Fruity",
      category: ["food"],
      price: 10.05,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
    {
      name: "Gusher Blue",
      brand: "Fruity",
      category: ["food"],
      price: 11.5,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
    {
      name: "Gusher Red",
      brand: "Fruity",
      category: ["food"],
      price: 12.5,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
    {
      name: "Gusher Green",
      brand: "Fruity",
      category: ["food"],
      price: 12.5,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
  ]);

  // create the paginator
  let paginator: PaginationStrategy = new PriceNextPage();

  // create the pagination options - search by brand of Fruity, category of Food, and page next
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 0.0,
    uniqueKey: new NilObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "next",
  };

  // retrieve the products
  let result = await paginator.paginate(pg, productsCollection!);

  // test that the products are in the right order
  expect(result[0].price).toBe(10.05);
});

it("Gets a random price and retrieves the correct page of products sorted by price from low to high", async () => {
  // insert products into the collection
  // retrieve four products using the given price
  // test that the right products are returned in the right order
});

it("Retrieves zero products when asked to retrieve products from an empty database", async () => {
  // attempt to retrieve products
  // test that none are returned
});
