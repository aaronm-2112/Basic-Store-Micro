// purpose:  implement the paginate method from the strategy base class. Goes to the next page.
//           Sorting is done by text weight and amount of matches with the user's query.

import { PaginationOptions } from "../helpers/pagination-options";
import { PaginationStrategy } from "./pagination-strategy-base";
import { Collection } from "mongodb";

export class TextNextPage extends PaginationStrategy {
  async paginate(
    options: PaginationOptions,
    productCollection: Collection<any>
  ) {
    // build the query out of the pagination options
    const query = this.buildPaginationQuery(options);

    // fetch the next page of products
    let nextPageOfProducts = await productCollection
      .aggregate([
        // use the text index to match the query
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
        // paginate by the text score; use the _id field when handling ties in text score to avoid skipping results with matching text scores
        {
          $match: {
            $or: [
              { score: { $lt: options.sortKey as number } },
              {
                $and: [
                  {
                    score: options.sortKey as number,
                    _id: { $gt: options.uniqueKey },
                  },
                ],
              },
            ],
          },
        },
        // return only 4 results
        { $limit: 4 },
      ])
      // convert the final results into an array
      .toArray();

    // set the fetched page of products as the current page of products
    this.setPageOfProducts(nextPageOfProducts);
  }
}
