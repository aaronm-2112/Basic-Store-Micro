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

// Method: insertOne
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
  let id = await pr.create(pm);

  // find the document in the repository using the id
  let productFromId = await pr.findOne(id);

  // assert that the found document and the inserted document match
  expect(productFromId).toEqual(pm);
});

// Might make both of these the same method and incrementing or decrementing quantity will depend on a status enum for order created ort cancelled
// Method: orderCreated
// Invoked by the order created event listener
it("Decrease the quantity of a product found by its id", async () => {});

// Method: orderCancelled
// used by the order cancelled event listener
it("Increases the quantity of a product by its id", async () => {});

// Method: update
// used when the client is editing a product they created
it("Updates all the product fields changed by the client", async () => {});

// Method: delete
// used when the client wants to delete a product they created
it("Deletes a product by product id", async () => {});

// Method: findByCategory
// used by the client when they are searching for products by category
it("Finds a set of products that match the category(ies)", async () => {});

// Method: findByName
// used by the client when they are searching for products by name (e.g. sneakers)
it("Finds products with a matching name or substring", async () => {});

// Method: findBySeller
// used by the client when they are searching for products from a particular seller
it("Finds all the products by a particular seller", async () => {});
