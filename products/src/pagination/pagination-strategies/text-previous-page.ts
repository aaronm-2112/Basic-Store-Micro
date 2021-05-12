// purpose: Using the given unique key and query go to the previous results weighed by matching words in the query.

import { Collection, ObjectId } from "mongodb";
import { categories } from "../../models/categories-model";
import { ProductModel } from "../../models/product-model";
import { PaginationOptions } from "../helpers/pagination-options";
import { PaginationStrategy } from "./pagination-strategy-base";

// extend the PaginationStrategy base class
export class TextPreviousPage extends PaginationStrategy {
  // implement paginate
  async paginate(
    options: PaginationOptions,
    productCollection: Collection<any>
  ) {
    //      write the pagination query to search by category and brand name, if one is givem, as phrases
    //      weigh the results by the number of matching words
    //      sort the results by the weight
    //      limit the results to 4
    //      turn the remaining results into an array
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
