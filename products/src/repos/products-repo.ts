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

  async findOne(id: string) {
    this.productsCollection?.findOne({ _id: id });
  }
}
