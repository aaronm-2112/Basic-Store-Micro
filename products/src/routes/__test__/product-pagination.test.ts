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

// the repository used in the tests
let pr: ProductsRepo;

// before any tests run connect to the test database and run our migrations on it
beforeAll(async () => {
  await connectToTestDatabase(dbConfig.databaseName);
  await runMigrationsOnTestDatabase();
  pr = new ProductsRepoPagination();
});

it("Sort method text - Retrieves the correct products when given valid query parameters", async () => {
  // insert products

  // request the first set of products
  let result = await request(app).get("/api/products?").send().expect(200);

  // ensure we get matching products

  // request the next page of products using the largest ObjectID as the key

  // ensure we get the correct products
});
