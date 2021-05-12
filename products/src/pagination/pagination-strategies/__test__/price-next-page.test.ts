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
import { PaginationOptions } from "../../helpers/pagination-options";
import { sortMethods } from "../../../repos/sort-methods";
import { categories } from "../../../models/categories-model";
import { TextNextPagePagination } from "../text-next-page";

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

// tests that first page pagination works
it("Gets a price of 0 retrieves the first page of products sorted by price from low to high", async () => {
  // insert products into the collection
  await productsCollection?.insertMany(products);

  // create the paginator
  let paginator: PaginationStrategy = new PriceNextPage();

  // create the pagination options - search by brand of Fruity, category of Food, and page next
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 0.0,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "next",
  };

  // retrieve the products
  let result = await paginator.paginate(pg, productsCollection!);

  // test that the products are in the right order
  expect(result[0].price).toBe(10.05);
  expect(result[1].price).toBe(11.5);
  expect(result[2].price).toBe(12.5);
  expect(result[3].price).toBe(12.5);
});

// tests that random page pagination works
it("Gets a random price and retrieves the correct page of products sorted by price from low to high", async () => {
  // insert products into the collection
  await productsCollection?.insertMany(products);

  // create the paginator
  let paginator: PaginationStrategy = new PriceNextPage();

  // create the pagination options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 12.5,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "next",
  };

  // retrieve the last two products using the paginator
  let result = await paginator.paginate(pg, productsCollection!);

  // test that the right products are returned in the right order
  expect(result[0].price).toBe(12.5);
  expect(result[1].price).toBe(12.5);
});

it("Retrieves zero products when asked to retrieve products from an empty database", async () => {
  // attempt to retrieve products
  // create the paginator
  let paginator: PaginationStrategy = new PriceNextPage();

  // create the pagination options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 0.0,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "next",
  };

  // fetch products
  let results = await paginator.paginate(pg, productsCollection!);

  // test that none are returned
  expect(results.length).toBe(0);
});

it("Gets a brand and category, and only returns products of that brand and in that category ordered by price", async () => {
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
    sortKey: 0.0,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    brand: "Fruity",
    page: "next",
  };

  // create the paginator
  let paginator = new TextNextPagePagination();

  // retrieve products
  let results = await paginator.paginate(pg, productsCollection!);

  // ensure only products of the correct brand and category are returned
  expect(results.length).toBe(3);
  expect(results[0].name).toBe("Gusher");
  expect(results[1].name).toBe("Gusher Blue");
  expect(results[2].name).toBe("Gusher Red");
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

  // create the paginaiton options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.PRICE_LOW_TO_HIGH,
    categories: categories.FOOD,
    sortKey: 0.0,
    uniqueKey: new ObjectId(),
    query: "Gushers",
    page: "next",
  };
  // create the paginator
  let paginator = new TextNextPagePagination();

  // retrieve products
  let results = await paginator.paginate(pg, productsCollection!);

  // ensure only products of the correct category are returned - of any brand
  expect(results.length).toBe(3);
  expect(results[0].name).toBe("Gusher");
  expect(results[1].name).toBe("Gusher Blue");
  expect(results[2].name).toBe("Gusher Red");
  expect(results[2].brand).toBe("Rhode Island Fruit");
});
