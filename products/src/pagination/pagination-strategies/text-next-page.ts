// purpose:  implement the paginate method from the strategy base class. Goes to the next page.
//           Sorting is done by text weight and amount of matches with the user's query.

import { PaginationOptions } from "../helpers/pagination-options";
import { PaginationStrategy } from "./pagination-strategy-base";
import { ObjectId, Collection } from "mongodb";

export class TextNextPage extends PaginationStrategy {
  async paginate(
    options: PaginationOptions,
    productCollection: Collection<any>
  ) {
    // extract the brand, query, and category
    let brand = options.brand;
    let query = options.query;
    let category = options.categories;

    // declare the variable that will be formatted to encompass all of the query terms
    let finalQuery = ``;
    // if brand exists add it to the query as a phrase search
    if (brand) finalQuery += `"${brand}" `;
    // if category exists in the query add it to the query as a phrase search
    if (category) finalQuery += `"${category}" `;
    // if keywords exists in the user's query add it to the query as a keyword search
    if (query) finalQuery += query;

    // extract the sortKey and objectId
    let sortKey: number = options.sortKey as number;
    let id: ObjectId = options.uniqueKey;

    let nextPageOfProducts = await productCollection
      .aggregate([
        // use the text index to match the query
        { $match: { $text: { $search: `${finalQuery}` } } },
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
              { score: { $lt: sortKey } },
              { $and: [{ score: sortKey, _id: { $gt: id } }] },
            ],
          },
        },
        // return only 4 results
        { $limit: 4 },
      ])
      // convert the final results into an array
      .toArray();

    // place the results into the products list
    this.products = nextPageOfProducts;
  }
}
