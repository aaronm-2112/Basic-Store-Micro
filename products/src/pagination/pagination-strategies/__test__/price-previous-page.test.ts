// Purpose: Test paginating to the 'previous' page when sorthing by price

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
import { PricePreviousPage } from "../price-previous-page";

// Things to be tested:
// 1. Potential query situations for paging to the previous page:
//  Query with a brand, keywords, and across all categories                     [done]
//  Query by brand and a specific category                                      [done]
//  Query by category and no brand with keywords                                [done]

// 2. Other general things:
//  Ensure the pagination returns 0 results on empty database                   [done]
//  Ensure the pagination handles ties                                          [done]
//  Ensure the pagination handles products with multiple categories correctly   [done]

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

// test products to insert into the database
let products: Array<ProductModel> = [
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
];

// tests paging to the previous page given any random price works
it("Gets a price and returns a page of products with a lower price", async () => {
  // insert products into the collection
  await productsCollection?.insertMany(products);

  // create the paginator
  let paginator: PaginationStrategy = new PricePreviousPage();
  // create the pagination options - search by brand of Fruity, category of Food, and page next
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 12.0,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "previous",
  };

  // retrieve the products
  let results = await paginator.paginate(pg, productsCollection!);

  // test that the products are in the right order
  expect(results.length).toBe(2);
  expect(results[0].price).toBe(10.05);
  expect(results[1].price).toBe(11.5);
});

it("Retrieves zero products when asked to retrieve products from an empty database", async () => {
  // create the paginator
  let paginator: PaginationStrategy = new PricePreviousPage();

  // create the pagination options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 0.0,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "previous",
  };

  // fetch products
  let results = await paginator.paginate(pg, productsCollection!);

  // test that none are returned
  expect(results.length).toBe(0);
});

it("Gets a brand, category, and price, then returns products in that category and in that brand with a lower price than what was given", async () => {
  // create dummy product data
  let products: Array<ProductModel> = [
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
      brand: "Viggo's Fruits",
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
      name: "Gusher Blue",
      brand: "Fruity",
      category: ["candy"],
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
      brand: "Dale & Johnson Fruit",
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
  ];

  // create the pagination options
  // create the pagination options - search by brand of Fruity, category of Food, and page next
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 12.5,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "previous",
  };

  // create the paginator
  let paginator = new PricePreviousPage();

  // retrieve products
  let results = await paginator.paginate(pg, productsCollection!);

  // ensure only products of the correct brand and category are returned
  expect(results.length).toBe(1);
  expect(results[0].name).toBe("Gusher");
  expect(results[0].brand).toBe("Fruity");
});

it("Gets a category, and only returns products in that category ordered by price", async () => {
  // create dummy product data
  let products: Array<ProductModel> = [
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
      brand: "Rhode Island Fruit",
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
      category: ["Groceries"],
      price: 13.5,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
  ];

  await productsCollection!.insertMany(products);

  // create the paginaiton options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 13.5,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    page: "previous",
  };
  // create the paginator
  let paginator = new PricePreviousPage();

  // retrieve products
  let results = await paginator.paginate(pg, productsCollection!);

  // ensure only products of the correct category are returned - of any brand
  expect(results.length).toBe(3);
  expect(results[0].name).toBe("Gusher");
  expect(results[1].name).toBe("Gusher Blue");
  expect(results[2].name).toBe("Gusher Red");
  expect(results[2].brand).toBe("Rhode Island Fruit");
});

it("Returns products containing multiple categories that are cheaper than the given price and have at least one category that matches the category in the query", async () => {
  let products: Array<ProductModel> = [
    {
      name: "Gusher",
      brand: "Fruity",
      category: ["food, candy"],
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
      category: ["food, candy"],
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
      name: "Pez Dispenser",
      brand: "Fruity",
      category: ["candy, entertainment"],
      price: 10.5,
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
      price: 8.5,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
  ];

  // insert the items into the collection
  await productsCollection!.insertMany(products);

  // create the paginator
  let paginator: PaginationStrategy = new PricePreviousPage();

  // create the pagination options - search for candy, and a price less than 12.5
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.CANDY,
    sortKey: 12.5,
    uniqueKey: new ObjectId(),
    query: "Gushers Pez",
    page: "previous",
  };

  let results = await paginator.paginate(pg, productsCollection!);

  // ensure that we have three items and they are only in the candy category
  expect(results.length).toBe(3);
  expect(results[1].name).toBe("Gusher");
  expect(results[2].name).toBe("Pez Dispenser");
  expect(results[3].name).toBe("Gusher Blue");
});

it("Returns products across all categories when given a brand and keywords", async () => {
  let products: Array<ProductModel> = [
    {
      name: "Gusher",
      brand: "Fruity",
      category: ["candy"],
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
      category: ["entertainment"],
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
      category: ["groceries"],
      price: 12.6,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
  ];

  // insert the products into the database
  await productsCollection!.insertMany(products);

  // create the pagination options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    sortKey: 13.0,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "previous",
  };

  // create the paginator
  let paginator: PaginationStrategy = new PricePreviousPage();

  // paginate
  let results = await paginator.paginate(pg, productsCollection!);

  // test the results
  expect(results.length).toBe(4);
  expect(results[0].name).toBe("Gusher");
  expect(results[1].name).toBe("Gusher Blue");
  expect(results[2].name).toBe("Gusher Red");
  expect(results[3].name).toBe("Gusher Green");
});
