// Purpose: Test paginating to the 'previous' page when sorting by text relevance

/* 
  Note: Some of the following tests have a dependency between the pagination method and the test
  Why: Text scoring logic is duplicated in the test and pagination method but never encapsulated in a function or object
       if one chnages the tests breaks.
  Solution: One possible solution is to make an object that builds and returns
            objects used in the aggregation pipeline utilized by paginate. This would centralize any text score assigning, sorting, etc
            to one place and make the tests less brittle. I won't do that because this isn't the focus of the project, and it would take time.

*/
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

  await productsCollection!.insertMany(pageOne);

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

  // create the pgainator
  let paginator: TextPreviousPage = new TextPreviousPage();

  // fetch the products
  await paginator.paginate(pg, productsCollection!);
  let pageOneResults = await paginator.getPaginationResult();

  // expect that there are two products returned
  expect(pageOneResults.products.length).toBe(2);
});

it("Returns products with a higher text weight than provided across all brands in a specific category given keywords", async () => {
  // create a page of products that have the same category and different brands
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
      brand: "Smiley",
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
      name: "Lezlie's Sink Gusher",
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
  ];
  // insert the page into the database
  await productsCollection!.insertMany(pageOne);

  // create a pagination options object that has a 0 value sortKey, category of food,  and does not include a brand name field
  let pg: PaginationOptions = {
    sortKey: 0,
    sortMethod: sortMethods.TEXT,
    uniqueKey: new ObjectId(0),
    page: "previous",
    categories: categories.FOOD,
    query: "Gusher",
  };

  // create the paginator
  let paginator: TextPreviousPage = new TextPreviousPage();

  // fetch the products
  await paginator.paginate(pg, productsCollection!);
  let pageOneResults = paginator.getPaginationResult();

  // expect to have 4 products
  expect(pageOneResults.products.length).toBe(4);
});

it("Returns products with a higher text weight than provided across all brands that have multiple categories - and one that matches the desired category - sorted by text relevancy", async () => {
  //  create products with any brand and multiple categories -- ensure they all have "food"
  let pageOne = [
    {
      name: "Gusher",
      brand: "Fruity",
      category: ["food", "entertainment"],
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
      brand: "Smiley",
      category: ["food", "gardening"],
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
      category: ["food", "gardening"],
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
      category: ["food", "houseware"],
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

  //  insert the products
  await productsCollection!.insertMany(pageOne);

  //  create the pagination options object with a sortKey of 0, category of food, and no brand
  let pg: PaginationOptions = {
    categories: categories.FOOD,
    sortMethod: sortMethods.TEXT,
    sortKey: 0,
    uniqueKey: new ObjectId(0),
    page: "previous",
  };

  //  create the paginator
  let paginator = new TextPreviousPage();

  //  fetch the results
  await paginator.paginate(pg, productsCollection!);
  let pageOneResults = paginator.getPaginationResult();

  //  expect that we retrieve 4 products
  expect(pageOneResults.products.length).toBe(4);
});

it("Paginates to the first page of results from the second page of results with tie breaking", async () => {
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

  // create the pagination options object
  let pg: PaginationOptions = {
    sortKey: 2.85,
    sortMethod: sortMethods.TEXT,
    page: "previous",
    query: "Gusher family pack",
    brand: "Fruity",
    categories: categories.FOOD,
    uniqueKey: textScoreResults[4].id, // first item on the second page of results
  };

  let paginator = new TextPreviousPage();

  await paginator.paginate(pg, productsCollection!);
  let pageOneResults = paginator.getPaginationResult();

  expect(pageOneResults.products.length).toBe(4);
});
