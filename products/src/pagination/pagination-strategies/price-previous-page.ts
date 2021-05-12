// purpose: Using the given price and unique key go to the previous set of search results

import { Collection } from "mongodb";
import { categories } from "../../models/categories-model";
import { ProductModel } from "../../models/product-model";
import { PaginationOptions } from "../helpers/pagination-options";
import { PaginationStrategy } from "./pagination-strategy-base";

// extend the PaginationStrategy base class

// implement paginate
export class PricePreviousPage extends PaginationStrategy {
  //  write the pagination query to catch ties and retrieve results cheaper than the current price
  async paginate(
    options: PaginationOptions,
    productsCollection: Collection<any>
  ) {
    //      sort the results by increasing price
    //      limit the results to 4
    //      turn the results into an array
    //      map the results to an array of ProductModels
    //      return the products
    // return mock data so tests can run
    let pm: ProductModel = {
      name: "test",
      price: 12,
      description: "test",
      imageURI: "test",
      category: [categories.FOOTWEAR],
      quantity: 12,
      brand: "Celery",
      user: {
        username: "test",
        email: "test",
      },
    };

    return [pm];
  }
}
