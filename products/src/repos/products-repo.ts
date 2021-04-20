import { client } from "../client";
import { ProductModel } from "../models/product-model";
import { dbConfig } from "../config/database-config";

export class ProductsRepo {
  // get the products collection from the mongo client
  private productsCollection = client.getCollection(
    dbConfig.productsCollectionName
  );

  // create a product in the products database and get back a product ID
  async create(pm: ProductModel): Promise<string> {
    try {
      // insert the product into the collection
      let res = await this.productsCollection!.insertOne(pm);

      // get the id of the inserted product
      let insertedId = res.insertedId;

      // return the id to the client
      return insertedId;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: string): Promise<ProductModel | undefined> {
    try {
      // search for the product by id
      let res = await this.productsCollection!.findOne({ _id: id });

      // check if no product is found
      if (!res) {
        // return undefined
        return undefined;
      }

      // create the product model using the document data
      let product: ProductModel = {
        name: res.name,
        price: res.price,
        description: res.description,
        imageURI: res.imageURI,
        category: res.category,
        quantity: res.quantity,
        user: res.user,
      };

      // return the product model to the client
      return product;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findByCategory(category: string): Promise<Array<ProductModel>> {
    return [
      {
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
      },
    ];
  }

  async findByName(name: string): Promise<Array<ProductModel>> {
    return [
      {
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
      },
    ];
  }

  async findBySeller(sellerName: string): Promise<Array<ProductModel>> {
    return [
      {
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
      },
    ];
  }

  async updateProduct(updatedProduct: ProductModel, id: string) {
    try {
      console.log(updatedProduct);
      // update the whole document using the passed in product
      let res = await this.productsCollection!.updateOne(
        { _id: id },
        {
          $set: {
            name: updatedProduct.name,
            price: updatedProduct.price,
            description: updatedProduct.description,
            category: updatedProduct.category,
            quantity: updatedProduct.quantity,
            imageURI: updatedProduct.imageURI,
            user: updatedProduct.user,
            // "user.email": updatedProduct.user.email,
            // "user.username": updatedProduct.user.username,
          },
        }
      );

      // ensure the update was successful
      if (!res.result.ok) {
        throw new Error("Could not update the product");
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteProduct(id: string) {}

  async changeQuantity(id: string, up: boolean) {
    try {
      let updateValue;
      if (up) {
        updateValue = 1;
      } else {
        updateValue = -1;
      }

      // find the product by its id and increment it
      let document = await this.productsCollection!.updateOne(
        { _id: id },
        { $inc: { quantity: updateValue } }
      );

      // check the document to ensure it updated
      if (!document.result.ok) {
        throw new Error("Product not updated");
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
