// purpose: Define different pagination algorithms for paginating by text, price, and date.

import { ProductModel } from "../../models/product-model";
import { PaginationOptions } from "../pagination-options";
import { Collection } from "mongodb";

export abstract class PaginationStrategy {
  //  products: Collection<any>;

  // constructor(productsCollection: Collection<any>) {
  //   // this.products = productsCollection;
  // }
  // declare an abstract paginate method that takes a set of pagination options via the PaginationOptions struct
  abstract paginate(
    options: PaginationOptions,
    products: Collection<any>
  ): Promise<Array<ProductModel>>;
}