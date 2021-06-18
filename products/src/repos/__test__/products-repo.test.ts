import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../test/setup";
import { dbConfig } from "../../config/database-config";
import { ProductsRepo } from "../products-repo-base";
import { ProductModel } from "../../models/product-model";
import { ProductsRepoPagination } from "../products-repo-pagination";

// the repository used in the tests
let pr: ProductsRepo;

// before any tests run connect to the test database and run our migrations on it
beforeAll(async () => {
  await connectToTestDatabase(dbConfig.databaseName);
  await runMigrationsOnTestDatabase();
  pr = new ProductsRepoPagination();
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
    brand: "Nike",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  // insert the product into the repository
  let id = await pr.create(pm);

  // find the document in the repository using the id
  let productFromId = await pr.findOne(id);

  expect(productFromId).not.toBe(undefined);

  // assert that the found document and the inserted document match
  expect(productFromId!.description).toEqual(pm.description);
  expect(productFromId!.category).toEqual(pm.category);
  expect(productFromId!.name).toEqual(pm.name);
  expect(productFromId!.price).toEqual(pm.price);
  expect(productFromId!.imageURI).toEqual(pm.imageURI);
  expect(productFromId!.quantity).toEqual(pm.quantity);
  expect(productFromId!.user.email).toEqual(pm.user.email);
  expect(productFromId!.user.username).toEqual(pm.user.username);
});

it("Fails to insert a product with a negative price", async (done) => {
  // create a product
  let pm: ProductModel = {
    name: "Comb",
    price: -12.5,
    quantity: 2,
    description: "A basic comb for hair.",
    category: ["hair care"],
    imageURI: "/path/to/comb/image",
    brand: "Viggo's Thrift",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  // attempt to insert the product into the database
  try {
    // should throw an error b/c price is negative
    await pr.create(pm);
    // force a failure if the database did not throw an error
    expect("a").toBe("b");
  } catch (e) {
    // convert e into an Error
    let er = e as Error;

    // check that we got a document validation error
    expect(er.message).toBe("MongoError: Document failed validation");

    // end the test
    done();
  }
});

// // Might make both of these the same method and incrementing or decrementing quantity will depend on a status enum for order created ort cancelled
// // Method: orderCreated
// Invoked by the order created event listener -- will eventually add a version number to this test fro optimistic concurrency
it("Decrease the quantity of a product found by its id", async () => {
  // insert a product into the database with a quantity of 1
  let p: ProductModel = {
    name: "Comb",
    price: 12.5,
    quantity: 1,
    description: "A basic comb for hair.",
    category: ["hair care"],
    imageURI: "/path/to/comb/image",
    brand: "Adidas",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let pid = await pr.create(p);

  // decrement the product's quantity by calling orderCreated
  await pr.changeQuantity(pid, false);

  // retrieve the updated product from the database
  let updatedP = await pr.findOne(pid);

  // check that the product's quantity is 0
  expect(updatedP!.quantity).toBe(0);
});

// // Method: orderCancelled
// // used by the order cancelled event listener -- will eventually add a version number to this test for optimistic concurrency
it("Increases the quantity of a product by its id", async () => {
  // insert a product into the database with a quantity of 1
  let p: ProductModel = {
    name: "Comb",
    price: 12.5,
    quantity: 1,
    description: "A basic comb for hair.",
    category: ["hair care"],
    imageURI: "/path/to/comb/image",
    brand: "Globalistas",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let pid = await pr.create(p);

  // increment the product's quantity by calling orderCancelled
  await pr.changeQuantity(pid, true);

  // retrieve the updated product from the database
  let updatedP = await pr.findOne(pid);

  // check that the product's quantity is 2
  expect(updatedP!.quantity).toBe(2);
});

// // Method: update
// // used when the client is editing a product they created
it("Updates all the product fields changed by the client", async () => {
  // insert a product into the database
  let p: ProductModel = {
    name: "Comb",
    price: 12.5,
    quantity: 1,
    description: "A basic comb for hair.",
    category: ["hair care"],
    imageURI: "/path/to/comb/image",
    brand: "Roche",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let pid = await pr.create(p);

  // update the product's field values
  p.name = "Black Comb";
  p.price = 13.2; // remember to make this a double when inserting into the db or we get a validation error
  p.description = "A black comb for hair care.";

  // update the product with the new field values
  await pr.updateProduct(p, pid);

  // find the product in the database
  let updatedProduct = await pr.findOne(pid);

  // check that the fields changed by the client have been updated
  expect(updatedProduct!.name).toBe(p.name);
  expect(updatedProduct!.price).toBe(p.price);
  expect(updatedProduct!.description).toBe(p.description);

  // check that fields left unchanged by the client are still the same
  expect(updatedProduct!.category[0]).toBe(p.category[0]);
  expect(updatedProduct!.imageURI).toBe(p.imageURI);
  expect(updatedProduct!.quantity).toBe(p.quantity);
  expect(updatedProduct!.user.email).toBe(p.user.email);
  expect(updatedProduct!.user.username).toBe(p.user.username);
});

// // Method: delete
// // used when the client wants to delete a product they created
it("Deletes a product by product id", async () => {
  // insert a product into the database
  let p: ProductModel = {
    name: "Comb",
    price: 12.5,
    quantity: 1,
    description: "A basic comb for hair.",
    category: ["hair care"],
    imageURI: "/path/to/comb/image",
    brand: "Roche",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let pid = await pr.create(p);

  // call the delete method
  await pr.deleteProduct(pid);

  // attempt to retrieve the product
  let deletedProduct = await pr.findOne(pid);

  // ensure the returned product is undefined
  expect(deletedProduct).toBe(undefined);
});
