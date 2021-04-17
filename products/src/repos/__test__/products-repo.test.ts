import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../test/setup";
import { dbConfig } from "../../config/database-config";
import { ProductsRepo } from "../products-repo";
import { ProductModel } from "../../models/product-model";

// before any tests run connect to the test database and run our migrations on it
beforeAll(async () => {
  await connectToTestDatabase(dbConfig.databaseName);
  await runMigrationsOnTestDatabase();
});

it("Inserts a product into the database successfully", async () => {
  // create a product
  let pm: ProductModel = {
    name: "Comb",
    price: 12.5,
    quantity: 2,
    description: "A basic comb for hair.",
    category: ["hair care"],
    imageURI: "/path/to/comb/image",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  // crceate the products repository
  let pr: ProductsRepo = new ProductsRepo();

  // insert the product into the repository
  let pmr = await pr.create(pm);

  expect(pmr).toEqual(pm);
});
