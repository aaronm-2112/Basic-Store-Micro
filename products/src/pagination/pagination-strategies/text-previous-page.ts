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
        // sort by text score ( descending ) and _id ( ascending )
        { $sort: { score: { $meta: "textScore" }, _id: 1 } },
        // get products with greater text score values than the provided sortKey posseses and handle ties with the objectId
        {
          $match: {
            $or: [
              { score: { $gt: options.sortKey as number } },
              {
                $and: [
                  {
                    score: options.sortKey as number,
                    _id: { $lt: options.uniqueKey },
                  },
                ],
              },
            ],
          },
        },
      ])
      // limit the results to 4
      .limit(4)
      // turn the remaining results into an array
      .toArray();

    this.setPageOfProducts(pageOfProducts);
  }
}
