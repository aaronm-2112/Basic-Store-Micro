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

it("Sort method text - Throws an error when given an invalid value for the sort method query parameter", async () => {
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

it("Sort method text - Returns a 200 when given a white listed value for the sortMethod query parameter", async () => {
  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "price: low - high";
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
    .expect(StatusCodes.OK);
});

it("Page text - Throws an error when given an invalid number for the page query parameter", async () => {
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

it("Page text - Returns a 200 when given a white listed value for the page query parameter", async () => {
  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "price: low - high";
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
    .expect(StatusCodes.OK);
});

it("UniqueKey text - Returns a 400 when given an invalid Mongo ObjectId to the uniqueKey query parameter", async () => {
  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "price: low - high";
  let page = "next";
  let sortKey = 0;
  let uniqueKey = "i";
  let category = "food";
  let query = "Gushers";

  // run the SUT
  await request(app)
    .get(
      `/api/products?sortMethod=${sortMethod}&page=${page}&sortKey=${sortKey}&uniqueKey=${uniqueKey}&category=${category}&query=${query}`
    )
    .expect(StatusCodes.CLIENT_ERROR);
});

it("UniqueKey text - Returns a 200 when given a valid Mongo ObjectId to the uniqueKey query parameter", async () => {
  // create a valid mongo ObjectId
  let objectId = new ObjectId("timtamtomted");

  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "price: low - high";
  let page = "next";
  let sortKey = 0;
  let uniqueKey = objectId.toHexString(); // pass in the hex string value
  let category = "food";
  let query = "Gushers";

  // run the SUT
  await request(app)
    .get(
      `/api/products?sortMethod=${sortMethod}&page=${page}&sortKey=${sortKey}&uniqueKey=${uniqueKey}&category=${category}&query=${query}`
    )
    .expect(StatusCodes.OK);
});

it("Query text - Returns a 400 when given an empty string for the query parameter", async () => {
  // create a valid mongo ObjectId
  let objectId = new ObjectId("timtamtomted");

  // create the wrong set of query paramaters to pass in for sorting by text
  let sortMethod = "price: low - high";
  let page = "next";
  let sortKey = 0;
  let uniqueKey = objectId.toHexString(); // pass in the hex string value
  let category = "food";
  let query = "";

  // run the SUT
  await request(app)
    .get(
      `/api/products?sortMethod=${sortMethod}&page=${page}&sortKey=${sortKey}&uniqueKey=${uniqueKey}&category=${category}&query=${query}`
    )
    .expect(StatusCodes.CLIENT_ERROR);
});

// it("Sort method text - Creates the pagination repository given the correct query paramaters", async () => {
//   // create the spy
//   let paginationSpy = jest.spyOn(
//     ProductsRepoPagination as any,
//     "createPaginationStrategy"
//   );

//   // run the SUT
//   await request(app).get("/api/products?").send().expect(200);

//   // ensure the SUT called the createPagination method
//   expect(paginationSpy).toHaveBeenCalled();
// });

// it("Sort method text - Retrieves the correct products when given valid query parameters", async () => {
//   // request the first set of products
//   let response = await request(app).get("/api/products?").send().expect(200);
//   let responseBody = response.body;

//   // ensure we get matching products

//   // request the next page of products using the largest ObjectID as the key

//   // ensure we get the correct products
// });
