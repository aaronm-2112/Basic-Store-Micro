import {
  connectToTestDatabase,
  runMigrationsOnTestDatabase,
} from "../../test/setup";
import { dbConfig } from "../../config/database-config";
import { ProductsRepo } from "../products-repo";
import { ProductModel } from "../../models/product-model";

// the repository used in the tests
let pr: ProductsRepo;

// before any tests run connect to the test database and run our migrations on it
beforeAll(async () => {
  await connectToTestDatabase(dbConfig.databaseName);
  await runMigrationsOnTestDatabase();
  pr = new ProductsRepo();
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

  // // crceate the products repository
  // let pr: ProductsRepo = new ProductsRepo();

  // insert the product into the repository
  let id = await pr.create(pm);

  // find the document in the repository using the id
  let productFromId = await pr.findOne(id);

  // assert that the found document and the inserted document match
  expect(productFromId).toEqual(pm);
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

// Might make both of these the same method and incrementing or decrementing quantity will depend on a status enum for order created ort cancelled
// Method: orderCreated
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
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let pid = await pr.create(p);

  // decrement the product's quantity by calling orderCreated
  await pr.orderCreated(pid);

  // retrieve the updated product from the database
  let updatedP = await pr.findOne(pid);

  // check that the product's quantity is 0
  expect(updatedP.quantity).toBe(0);
});

// Method: orderCancelled
// used by the order cancelled event listener -- will eventually add a version number to this test for optimistic concurrency
it("Increases the quantity of a product by its id", async () => {
  // insert a product into the database with a quantity of 1
  // increment the product's quantity by calling orderCancelled
  // retrieve the updated product from the database
  // check that the product's quantity is 2
});

// Method: update
// used when the client is editing a product they created
it("Updates all the product fields changed by the client", async () => {
  // insert a product into the database
  // create a product that has different field values
  // call the update method
  // find the product in the database
  // check that the updates have been made and that unchanged fields remain the same as that of the original product
});

// Method: delete
// used when the client wants to delete a product they created
it("Deletes a product by product id", async () => {
  // insert a product into the database
  // call the delete method
  // attempt to retrieve the product
  // ensure no product is found with that id
});

// Method: findByCategory
// used by the client when they are searching for products by category
it("Finds a set of products that match the category", async () => {
  // insert a set of products that have a category of "hair care"
  // find the products using the repo's findByCategory method
  // ensure that all of the inserted products are returned
});

// Method: findByCategory
// used by the client when they are searching for products by category
it("Finds a set of products that match the categories", async () => {
  // insert a set of products that have a category of "hair care" or/and "clothing"
  // search for products in the hair care and clothing categories using the repo's findByCategory method
  // ensure that all of the inserted products are returned
});

// Method: findByName
// used by the client when they are searching for products by name (e.g. sneakers)
// IMP: Since this is using a simple text search index we will not receive "sneakers" results when searching for shoes, for instance.
it("Finds products with a matching name or substring", async () => {
  // insert a set of products with "shoe" in their name
  // use the repo's findByName method to search for all products with shoe in the title
  // ensure that all of the inserted products are returned
});

// Method: findBySeller
// used by the client when they are searching for products from a particular seller
it("Finds all the products by a particular seller", async () => {
  // insert a set of products from seller "Viggo's Thrift"
  // search for viggo's thrift using findBySeller
  // ensure all of the inserted products are returned
});
