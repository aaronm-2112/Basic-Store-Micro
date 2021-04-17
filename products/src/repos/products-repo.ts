import { client } from "../client";
import { ProductModel } from "../models/product-model";
import { dbConfig } from "../config/database-config";

export class ProductsRepo {
  // get the products collection from the mongo client
  private productsCollection = client.getCollection(
    dbConfig.productsCollectionName
  );

  // create a product in the products database
  async create(pm: ProductModel): Promise<ProductModel> {
    await this.productsCollection!.insertOne(pm);

    return pm;
  }
}
