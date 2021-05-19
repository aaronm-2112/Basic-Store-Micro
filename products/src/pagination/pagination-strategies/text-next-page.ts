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
    let brand = options.brand;
    let query = options.query;
    let category = options.categories;

    let finalQuery = ``;
    if (brand) finalQuery += `"${brand}" `;
    if (category) finalQuery += `"${category}" `;
    if (query) finalQuery += query;
    let sortKey: number = options.sortKey as number;
    let id: ObjectId = options.uniqueKey;

    console.log(finalQuery);

    // Write a basic 'featured' style query where we wiegh the words and their presence and sort by that instead
    let res = await productCollection
      .find({
        $text: { $search: `${finalQuery}` },
      })
      // required in the MongoDB Node driver to allow weighing results by # of keyword matches
      .project({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, _id: -1 })
      .filter({
        input: "$score",
        as: "score",
        cond: {
          score: { $gt: ["score", sortKey] },
          _id: { $gt: ["$_id", id] },
        },
      })
      // limit results
      .limit(4)
      // turn the limited results into an array
      .toArray();

    this.products = res;
  }
}

//  $or: [
//   { score: { $gt: ["score", sortKey] } },
//   { _id: { $lt: ["_id", id] } },
// ],
