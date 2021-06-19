// purpose: Test the pagination route
import { dbConfig } from "../../config/database-config";
import { ProductsRepo } from "../../repos/products-repo-base";
import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../test/setup";
import request from "supertest";
import { app } from "../../app";
import { ProductsRepoPagination } from "../../repos/products-repo-pagination";
import { ObjectId } from "bson";
import { StatusCodes } from "../helpers/status-codes";

// the repository used in the tests
let pr: ProductsRepo;

// before any tests run connect to the test database and run our migrations on it
beforeAll(async () => {
  await connectToTestDatabase(dbConfig.databaseName);
  await runMigrationsOnTestDatabase();
  pr = new ProductsRepoPagination();
});

it("Sort method text - Throws an error when not given sorth method as a query parameters", async () => {
  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "text";
  let page = "next";
  let sortKey = 0;
  let uniqueKey = new ObjectId(0);
  let category = "food";
  let query = "Gushers";

  // run the SUT
  await request(app)
    .get(
      `/api/products?page=${page}&sortKey=${sortKey}&uniqueKey=${uniqueKey}&category=${category}&query=${query}`
    )
    .expect(StatusCodes.CLIENT_ERROR);
});

it("Sort method text - Throws an error when given an empty string for the sort method query parameters", async () => {
  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "";
  let page = "next";
  let sortKey = 0;
  let uniqueKey = new ObjectId(0);
  let category = "food";
  let query = "Gushers";

  // run the SUT
  await request(app)
    .get(
      `/api/products?sortMethod=${sortMethod}&page=${page}&sortKey=${sortKey}&uniqueKey=${uniqueKey}&category=${category}&query=${query}`
    )
    .expect(StatusCodes.CLIENT_ERROR);
});

it("Sort method text - Throws an error when given a number for the sort method query parameter", async () => {
  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "1";
  let page = "next";
  let sortKey = 0;
  let uniqueKey = new ObjectId(0);
  let category = "food";
  let query = "Gushers";

  // run the SUT
  await request(app)
    .get(
      `/api/products?sortMethod=${sortMethod}&page=${page}&sortKey=${sortKey}&uniqueKey=${uniqueKey}&category=${category}&query=${query}`
    )
    .expect(StatusCodes.CLIENT_ERROR);
});

it("Sort method text - Creates the pagination repository given the correct query paramaters", async () => {
  // create the spy
  let paginationSpy = jest.spyOn(
    ProductsRepoPagination as any,
    "createPaginationStrategy"
  );

  // run the SUT
  await request(app).get("/api/products?").send().expect(200);

  // ensure the SUT called the createPagination method
  expect(paginationSpy).toHaveBeenCalled();
});

it("Sort method text - Retrieves the correct products when given valid query parameters", async () => {
  // request the first set of products
  let response = await request(app).get("/api/products?").send().expect(200);
  let responseBody = response.body;

  // ensure we get matching products

  // request the next page of products using the largest ObjectID as the key

  // ensure we get the correct products
});
