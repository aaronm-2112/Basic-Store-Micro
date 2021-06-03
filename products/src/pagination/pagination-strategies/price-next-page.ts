import { PaginationOptions } from "../helpers/pagination-options";
import { PaginationStrategy } from "./pagination-strategy-base";
import { Collection, ObjectId } from "mongodb";

export class PriceNextPage extends PaginationStrategy {
  async paginate(options: PaginationOptions, products: Collection<any>) {
    let query = this.buildPaginationQuery(options);

    let page = await products
      .find({
        // find by matching keywords
        $text: { $search: `${query}` },
        // pagination logic - UP
        $or: [
          { price: { $gt: options.sortKey } },
          {
            price: options.sortKey,
            _id: { $gt: options.uniqueKey },
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
