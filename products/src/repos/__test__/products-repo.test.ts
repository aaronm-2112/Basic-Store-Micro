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

// // Method: findByCategory
// // used by the client when they are searching for products by category
it("Finds a set of products that match the category", async () => {
  // insert a set of products that have a category of "hair care"
  let p1: ProductModel = {
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

  let p2: ProductModel = {
    name: "Black Hair Dye",
    price: 10.5,
    quantity: 1,
    description: "Dye your hair black.",
    category: ["hair care"],
    imageURI: "/path/to/hair-dye/image",
    brand: "Roche",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let p3: ProductModel = {
    name: "Green Brush",
    price: 7.5,
    quantity: 1,
    description: "A basic brush for hair.",
    category: ["hair care"],
    imageURI: "/path/to/green-brush/image",
    brand: "Roche",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  await pr.create(p1);
  await pr.create(p2);
  await pr.create(p3);

  // find the products using the repo's findByCategory method
  let products = await pr.findByCategory("hair care");

  // ensure that all of the inserted products are returned
  expect(products.length).toBe(3);

  // ensure all of the returned products have hair care as their category
  expect(products[0].category[0]).toBe("hair care");
  expect(products[1].category[0]).toBe("hair care");
  expect(products[2].category[0]).toBe("hair care");
});

// // Method: findByName
// // used by the client when they are searching for products by name (e.g. sneakers)
// // IMP: Since this is using a simple text search index we will not receive "sneakers" results when searching for shoes, for instance.
it("Finds products with a matching name or substring", async () => {
  // insert a set of products with "shoe" in their name
  let p1: ProductModel = {
    name: "Nike Shoes",
    price: 12.5,
    quantity: 1,
    description: "A basic shoe for your feet.",
    category: ["footwear"],
    imageURI: "/path/to/comb/image",
    brand: "Roche",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let p2: ProductModel = {
    name: "Addidas Shoes",
    price: 12.5,
    quantity: 1,
    description: "A basic shoe for your feet.",
    category: ["footwear"],
    imageURI: "/path/to/comb/image",
    brand: "Roche",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  let p3: ProductModel = {
    name: "Shoes",
    price: 12.5,
    quantity: 1,
    description: "A basic shoe for your feet.",
    category: ["footwear"],
    imageURI: "/path/to/comb/image",
    brand: "Roche",
    user: {
      username: "Sears",
      email: "Searsshipping@gmail.com",
    },
  };

  await pr.create(p1);
  await pr.create(p2);
  await pr.create(p3);

  // use the repo's findByName method to search for all products with shoe in the title
  let products = await pr.findByName("shoes");

  // ensure that all of the inserted products are returned
  expect(products.length).toBe(3);
});

// // Method: findBySeller
// // used by the client when they are searching for products from a particular seller
it("Finds all the products by a particular seller", async () => {
  // insert a set of products from seller "Viggo's Thrift"
  let p: ProductModel = {
    name: "Nike Shoes",
    price: 12.5,
    quantity: 1,
    description: "A basic shoe for your feet.",
    category: ["footwear"],
    imageURI: "/path/to/comb/image",
    brand: "Roche",
    user: {
      username: "Viggo's Thrift",
      email: "viggothrift@gmail.com",
    },
  };

  await pr.create(p);

  // search for viggo's thrift using findBySeller
  let products = await pr.findBySeller("Viggo's Thrift");

  // ensure all of the inserted products are returned
  expect(products.length).toBe(1);
});

// it("Tests pagination", async () => {
//   let p: ProductModel = {
//     name: "Greenthumb",
//     price: 11.5,
//     quantity: 1,
//     description: "A basic shoe for your feet.",
//     category: ["footwear"],
//     imageURI: "/path/to/comb/image",
//     brand: "Nike",
//     user: {
//       username: "Viggo's Thrift",
//       email: "viggothrift@gmail.com",
//     },
//   };

//   let p2: ProductModel = {
//     name: "Silica",
//     price: 12.5,
//     quantity: 1,
//     description: "A basic shoe for your feet.",
//     category: ["footwear"],
//     imageURI: "/path/to/comb/image",
//     brand: "Nike",
//     user: {
//       username: "Viggo's Thrift",
//       email: "viggothrift@gmail.com",
//     },
//   };

//   let p3: ProductModel = {
//     name: "Court Compression Combo",
//     price: 13.5,
//     quantity: 1,
//     description: "A basic shoe for your feet.",
//     category: ["footwear"],
//     imageURI: "/path/to/comb/image",
//     brand: "Adidas",
//     user: {
//       username: "Viggo's Thrift",
//       email: "viggothrift@gmail.com",
//     },
//   };

//   let p4: ProductModel = {
//     name: "Flex Surge",
//     price: 14.5,
//     quantity: 1,
//     description: "A basic shoe for your feet.",
//     category: ["footwear"],
//     imageURI: "/path/to/comb/image",
//     brand: "Nike",
//     user: {
//       username: "Viggo's Thrift",
//       email: "viggothrift@gmail.com",
//     },
//   };

//   let p5: ProductModel = {
//     name: "Swollen Foot",
//     price: 16.5,
//     quantity: 1,
//     description: "A basic shoe for your feet.",
//     category: ["footwear"],
//     imageURI: "/path/to/comb/image",
//     brand: "Nike",
//     user: {
//       username: "Viggo's Thrift",
//       email: "viggothrift@gmail.com",
//     },
//   };

//   let pid = await pr.create(p);
//   await pr.create(p2);
//   await pr.create(p3);
//   await pr.create(p4);
//   await pr.create(p5);

//   // search for viggo's thrift using findBySeller
//   let products = await pr.samplePaginationQuery(
//     "footwear",
//     "Nike Shoes",
//     "price",
//     10.5,
//     pid,
//     "next"
//   );

//   console.log(products);

//   // console.log(products);
// });
