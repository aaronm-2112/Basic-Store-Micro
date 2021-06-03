// purpose: Using the given price and unique key go to the previous set of search results

import { Collection } from "mongodb";
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
    let query = this.buildPaginationQuery(options);

    let page = await productsCollection
      .find({
        // find by matching keywords
        $text: { $search: `${query}` },
        // pagination logic - down
        $or: [
          { price: { $lt: options.sortKey } },
          {
            $and: [
              {
                price: options.sortKey,
                _id: { $lt: options.uniqueKey },
              },
            ],
          },
        ],
      })
      // sort logic
      .sort({
        price: 1,
        _id: -1,
      })
      // limit results
      .limit(4)
      // turn the limited results into an array
      .toArray();

    this.setPageOfProducts(page);
  }
}
