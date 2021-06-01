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
    let query = this.buildPaginationQuery(options);

    // get the page of products that match the query
    let pageOfProducts = await productCollection
      // weigh the results by the number of matching words
      .aggregate([
        { $match: { $text: { $search: `${query}` } } },
        // project the text score onto the document results
        {
          $project: {
            score: { $meta: "textScore" },
            description: true,
            name: true,
            price: true,
            imageURI: true,
            category: true,
            brand: true,
            user: true,
            quantity: true,
          },
        },
        // get products with greater text score values than the provided sortKey posseses
        {
          $match: {
            score: { $gt: options.sortKey as number },
          },
        },
      ])
      .toArray();

    //      sort the results by the weight
    //      limit the results to 4
    //      turn the remaining results into an array
    //      map the results to an array of ProductModels
    //      return the products

    this.setPageOfProducts(pageOfProducts);
  }
}
