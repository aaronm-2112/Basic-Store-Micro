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
//  Contract with buildPaginationQuery is fulfilled
//  Contract with setPaginationProducts is fulfilled

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

afterEach(() => {
  jest.clearAllMocks();
});

// test the contract that requires pagination to set its pagination results as a class property
it("Ensures setProducts is called in the paginate method", async () => {
  // create the pagination options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    uniqueKey: new ObjectId(Infinity),
    sortKey: Infinity,
    query: "Gusher",
    brand: "Fruity",
    page: "next",
  };

  // create the paginator
  let paginator: PaginationStrategy = new TextPreviousPage();

  // create the paginator's spy -- use any to get around protected guard
  const setProductsSpy = jest.spyOn(paginator as any, `setPageOfProducts`);

  // paginate
  await paginator.paginate(pg, productsCollection!);

  // assert that the setProducts method was called in the paginate method
  expect(setProductsSpy).toHaveBeenCalled();
});

it("Ensures buildPaginationQuery is called in the pagination method", async () => {
  // create the pagination options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    uniqueKey: new ObjectId(Infinity),
    sortKey: Infinity,
    query: "Gusher",
    brand: "Fruity",
    page: "next",
  };

  // create the paginator
  let paginator: PaginationStrategy = new TextPreviousPage();

  // create the paginator's spy -- use any to get around protected guard
  const paginationQuerySpy = jest.spyOn(
    paginator as any,
    `buildPaginationQuery`
  );

  // paginate
  await paginator.paginate(pg, productsCollection!);

  // assert that the setProducts method was called in the paginate method
  expect(paginationQuerySpy).toHaveBeenCalled();
});

it("Returns a specific brand's products with a higher text weight than provided across all categories given a brand and keywords", async () => {
  // create a set of products
  let pageOne = [
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
      name: "Gushers",
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
      name: "Plant Gusher Pot",
      brand: "Fruity",
      category: ["gardening"],
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
      name: "Lezlie's Sink Gusher",
      brand: "Fruity",
      category: ["sink"],
      price: 10.05,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
  ];

  // insert one page of products into the database ( a page is 4 items at the moment)
  await productsCollection!.insertMany(pageOne);

  // create the pagination options -- setup the sortKey such that we get the four products with the highest text scores
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    sortKey: 0,
    uniqueKey: new ObjectId(0),
    page: "previous",
    brand: "Fruity",
    query: "Gusher",
  };

  // create the paginator
  let paginator = new TextPreviousPage();

  // paginate
  await paginator.paginate(pg, productsCollection!);

  // fetch the results
  let pageOneResults = paginator.getPaginationResult();

  // assert that we retrieved two items
  expect(pageOneResults.products.length).toBe(4);
  expect(pageOneResults.products[0].name).toBe("Gusher");
  expect(pageOneResults.products[1].name).toBe("Gushers");
  expect(pageOneResults.products[2].name).toBe("Plant Gusher Pot");
  expect(pageOneResults.products[3].name).toBe("Lezlie's Sink Gusher");
});

it("Returns a specific brand's products with a higher text weight than provided given a particular brand, category, and keywords", async () => {
  let pageOne = [
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
      name: "Gushers",
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
      name: "Plant Gusher Pot",
      brand: "Fruity",
      category: ["gardening"],
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
      name: "Lezlie's Sink Gusher",
      brand: "Sinkers",
      category: ["sink"],
      price: 10.05,
      description: "Tasty",
      imageURI: "/image",
      quantity: 12,
      user: {
        username: "woo woo",
        email: "woo@gmail.com",
      },
    },
  ];

  //

  // create the pagination options
  let pg: PaginationOptions = {
    brand: "Fruity",
    categories: categories.FOOD,
    query: "Gusher",
    page: "previous",
    sortKey: 0,
    uniqueKey: new ObjectId(0),
    sortMethod: sortMethods.TEXT,
  };
});

it("Returns products with a higher text weight than provided across all brands in a specific category given keywords", async () => {});

it("Handles ties in text weight when returning products on the previous page of results ", async () => {});

it("Returns products with a higher text weight than provided across all brands that have multiple categories - and one that matches the desired category - sorted by text relevancy", async () => {});
