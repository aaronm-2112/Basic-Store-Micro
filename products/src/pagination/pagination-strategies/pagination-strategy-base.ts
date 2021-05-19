// purpose: Define different pagination algorithms for paginating by text, price, and date.

import { ProductModel } from "../../models/product-model";
import { PaginationOptions } from "../helpers/pagination-options";
import { Collection } from "mongodb";
import PaginationResult from "../helpers/pagination-result";

export abstract class PaginationStrategy {
  protected products: any[];

  constructor() {
    this.products = [];
  }

  // declare an abstract paginate method that takes a set of pagination options via the PaginationOptions struct
  abstract paginate(
    options: PaginationOptions,
    products: Collection<any>
  ): Promise<void>;

  getPaginationResult(): PaginationResult {
    let products: ProductModel[] = this.products.map((productDocumnent) => {
      return {
        name: productDocumnent.name,
        price: productDocumnent.price,
        description: productDocumnent.description,
        imageURI: productDocumnent.imageURI,
        category: productDocumnent.category,
        quantity: productDocumnent.quantity,
        brand: productDocumnent.brand,
        user: productDocumnent.user,
      };
    });

    let textScore = this.products.map((productDocument) => {
      return productDocument.score;
    });

    // create the pgaination result object
    let results: PaginationResult = {
      products,
      textScore,
    };

    return results;
  }
}
