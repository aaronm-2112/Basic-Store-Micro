import { client } from "../client";
import { ProductModel } from "../models/product-model";
import { dbConfig } from "../config/database-config";
import { createCipher } from "crypto";

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

  async findOne(id: string): Promise<ProductModel> {
    try {
      // search for the product by id
      let res = this.productsCollection!.findOne({ _id: id });

      // check if no product is found
      //     return undefined

      // create an empty product model

      // fill the product model fields with the result

      // return the product model to the client
    } catch (e) {
      throw new Error(e);
    }
  }

  async orderCreated(id: string) {}
}
