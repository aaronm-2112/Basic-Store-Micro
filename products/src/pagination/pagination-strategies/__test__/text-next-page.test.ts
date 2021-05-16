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
import { PaginationOptions } from "../../helpers/pagination-options";
import { sortMethods } from "../../../repos/sort-methods";
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

// like hitting 'Enter' on a new query in the search bar - so give a searchKey of infinite
// rationale: We want results sorted in order of highest text relevancy (which is reepresented as a number for each product)
//            so the most relevant products are the ones closest to infinity.
it("Returns a specific brand's products across all categories given a brand and keywords", async () => {
  // insert dummy products into the database
  let products: Array<ProductModel> = [
    {
      name: "Gusher Gusher",
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
      name: "Gusher Green",
      brand: "Fruitilicious",
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

  // insert the products into the database
  await productsCollection!.insertMany(products);

  // create the pagination options object
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    uniqueKey: new ObjectId(undefined),
    sortKey: Infinity,
    query: "Gusher",
    brand: "Fruity",
    page: "next",
  };

  // create the paginator
  let paginator: PaginationStrategy = new TextNextPage();

  // fetch the products
  let paginationResults = await paginator.paginate(pg, productsCollection!);

  let paginationProducts = paginationResults.products;

  // test the results
  expect(paginationProducts.length).toBe(3);
  expect(paginationProducts[0].name).toBe("Gusher Gusher");
  expect(paginationProducts[1].name).toBe("Gusher Blue");
  expect(paginationProducts[2].name).toBe("Gusher Red");

  // get the text scores
  let textScore = paginationResults.textScore;

  // ensuere they exist
  expect(textScore).not.toBe(undefined);
  expect(textScore!.length).toBe(3);
});

it("Returns a specific brand's products in a single category given a particular brand, category, and keywords", async () => {
  // insert dummy products into the database
  let products: Array<ProductModel> = [
    {
      name: "Gusher Gusher",
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
      name: "Gusher Green",
      brand: "Fruitilicious",
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

  // insert the products into the database
  await productsCollection!.insertMany(products);

  // create the pg options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    sortKey: Infinity,
    uniqueKey: new ObjectId(undefined),
    categories: categories.FOOD,
    query: "Gushers",
    brand: "Fruity",
    page: "next",
  };

  // create the paginators
  let paginator: PaginationStrategy = new TextNextPage();

  // fetch the products
  let paginationResults = await paginator.paginate(pg, productsCollection!);

  let paginationProducts = paginationResults.products;

  expect(paginationProducts.length).toBe(2);
  expect(paginationProducts[0].name).toBe("Gusher Gusher");
  expect(paginationProducts[1].name).toBe("Gusher Blue");

  let textScore = paginationResults.textScore;

  expect(textScore).not.toBe(undefined);
  expect(textScore?.length).toBe(2);
});

it("Returns products across all brands in a specific category given keywords", async () => {
  // insert dummy products into the database
  let products: Array<ProductModel> = [
    {
      name: "Gusher Gusher",
      brand: "Cherri",
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
      brand: "Dope Fruits",
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
      name: "Gusher Green",
      brand: "Fruitilicious",
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

  // insert the products into the database
  await productsCollection!.insertMany(products);

  // create the pg options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    sortKey: Infinity,
    uniqueKey: new ObjectId(undefined),
    categories: categories.FOOD,
    query: "Gushers",
    page: "next",
  };

  // create the paginators
  let paginator: PaginationStrategy = new TextNextPage();

  // fetch the products
  let paginationResults = await paginator.paginate(pg, productsCollection!);

  let paginationProducts = paginationResults.products;

  expect(paginationProducts.length).toBe(4);
  expect(paginationProducts[0].name).toBe("Gusher Gusher");

  let textScores = paginationResults.textScore;
  expect(textScores).not.toBe(undefined);
  expect(textScores?.length).toBe(4);
});

it("Returns all products in a given category when not given keywords or brands", async () => {
  // insert dummy products into the database
  let products: Array<ProductModel> = [
    {
      name: "Gusher Gusher",
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
      name: "Gusher Green",
      brand: "Fruitilicious",
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

  // insert the products into the database
  await productsCollection!.insertMany(products);

  // create the pg options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    sortKey: Infinity,
    uniqueKey: new ObjectId(undefined),
    categories: categories.FOOD,
    page: "next",
  };

  // create the paginators
  let paginator: PaginationStrategy = new TextNextPage();

  // fetch the pagination results
  let paginationResult = await paginator.paginate(pg, productsCollection!);

  // extract the products
  let paginationProducts = paginationResult.products;

  expect(paginationProducts.length).toBe(2);
  expect(paginationProducts[0].name).toBe("Gusher Gusher");
  expect(paginationProducts[1].name).toBe("Gusher Blue");

  // extract the textScore of the results from paginationResults
  let textScore = paginationResult.textScore;

  expect(textScore).not.toBe(undefined);
  expect(textScore?.length).toBe(3);
});

it("Returns 0 products when searching for products in an empty database", async () => {
  // create the paginator
  let paginator = new TextNextPage();

  // create the pagination options
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    sortKey: Infinity,
    uniqueKey: new ObjectId(undefined),
    categories: categories.FOOD,
    page: "next",
  };

  // fetch the results of the pagination request
  let paginationResults = await paginator.paginate(pg, productsCollection!);

  // extract the products array
  let paginationProducts = paginationResults.products;

  // test the length of the arrays
  expect(paginationProducts.length).toBe(0);
  expect(paginationResults.textScore?.length).toBe(0);
});

// tests that when given a random sortKey it returns the next correct set of products on the 'next page'
it("Returns the next set of products sorted by text relevancy when given a random sort key (accounts for ties)", async () => {
  // insert page one of the data
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
      name: "Gusher Blue Family",
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
      name: "Gusher Green Family Pack",
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

  await productsCollection!.insertMany(products);

  // create the second page of products
  let productsPageTwo: Array<ProductModel> = [
    {
      name: "Gusher Pink",
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
      name: "Gusher Red-Green",
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

  await productsCollection!.insertMany(productsPageTwo);

  // get the text scores of all inserted products in sorted order - from most to least relevant and _id sorted ascending
  let res = await productsCollection!
    .find({
      // find by matching keywords
      $text: { $search: '"food" "Fruity" Gusher family pack' },
    })
    // required in the MongoDB Node driver to allow weighing results by # of keyword matches
    .project({ score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" }, _id: 1 }) // id sorted ascending
    // limit results
    .limit(8)
    // turn the limited results into an array
    .toArray();

  // extract the text score from the query results, sorted by text relevancy
  let textScoreResults = res.map((result) => {
    return { score: result.score, name: result.name, id: result._id };
  });

  console.log("The text score results", textScoreResults);

  // fetch the products using the sortKey of the final item on the first page of fetched results (in this case product #4 is Gusher Red)
  let paginator = new TextNextPage();
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    sortKey: textScoreResults[3].score, // the text score of the 4th item in the text score results
    uniqueKey: new ObjectId(textScoreResults[3].id),
    categories: categories.FOOD,
    page: "next",
  };
  let paginationResult = await paginator.paginate(pg, productsCollection!);

  // extract the products from the pagination results
  let paginationProducts = paginationResult.products;

  // ensure the correct page of products is returned in the right order
  expect(paginationProducts.length).toBe(4);
  expect(paginationProducts[0].name).toBe("Gusher Pink");
  expect(paginationProducts[1].name).toBe("Gusher Blue");
  expect(paginationProducts[2].name).toBe("Gusher Green");
  expect(paginationProducts[3].name).toBe("Gusher Red-Green");

  // extract the text scores from the results
  let paginationScores = paginationResult.textScore;
  // ensure the textScores are correct
  expect(paginationScores).not.toBe(undefined);
  expect(paginationScores![0]).toBe(2.85);
  expect(paginationScores![1]).toBe(2.85);
  expect(paginationScores![2]).toBe(2.85);
});

it("Pages through products correctly(as in never returning the same product twice) when dealing with two pages of ties", async () => {
  // insert page one of the data
  let pageOne: Array<ProductModel> = [
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
      name: "Gusher",
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
      name: "Gusher",
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
      name: "Gusher",
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

  await productsCollection!.insertMany(pageOne);
  // insert page two of the data
  let pageTwo: Array<ProductModel> = [
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
      name: "Gusher",
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
      name: "Gusher",
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
      name: "Gusher",
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
  await productsCollection!.insertMany(pageTwo);

  // get the text scores of all inserted products in sorted order - from most to least relevant
  let res = await productsCollection!
    .find({
      // find by matching keywords
      $text: { $search: '"food" "Fruity" Gusher' },
    })
    // required in the MongoDB Node driver to allow weighing results by # of keyword matches
    .project({ score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" }, _id: 1 }) // id sorted ascending
    // limit results
    .limit(8)
    // turn the limited results into an array
    .toArray();

  // extract the text score from the query results, sorted by text relevancy
  let textScoreResults = res.map((result) => {
    return { score: result.score, name: result.name, id: result._id };
  });

  // create the pagination options to get the first page of results
  let pg: PaginationOptions = {
    sortMethod: sortMethods.TEXT,
    sortKey: Infinity, // the text score of the 4th item in the text score results
    uniqueKey: new ObjectId(undefined),
    categories: categories.FOOD,
    page: "next",
  };

  // create the paginator
  let paginator = new TextNextPage();

  // fetch the first page of products
  let pageOneResults = await paginator.paginate(pg, productsCollection!);

  // test that 4 products have been returned in the correct order
  expect(pageOneResults.products.length).toBe(4);
  expect(pageOneResults.products[0].id).toBe(textScoreResults[0].id);
  expect(pageOneResults.products[1].id).toBe(textScoreResults[1].id);
  expect(pageOneResults.products[2].id).toBe(textScoreResults[2].id);
  expect(pageOneResults.products[3].id).toBe(textScoreResults[3].id);

  // edit the pg options to get the second page
  pg.sortKey = pageOneResults.textScore![3];
  pg.uniqueKey = pageOneResults.products[3].id!;

  // use the last products sortKey and uniqueKey and request the second page of products
  let pageTwoResults = await paginator.paginate(pg, productsCollection!);

  // test that the second page has been returned in the correct order
  expect(pageTwoResults.products.length).toBe(4);
  expect(pageTwoResults.products[0].id).toBe(textScoreResults[4].id);
  expect(pageTwoResults.products[1].id).toBe(textScoreResults[5].id);
  expect(pageTwoResults.products[2].id).toBe(textScoreResults[6].id);
  expect(pageTwoResults.products[3].id).toBe(textScoreResults[7].id);
});

it("Returns products that have multiple categories - and one that matches the desired category - sorted by text relevancy", async () => {});
