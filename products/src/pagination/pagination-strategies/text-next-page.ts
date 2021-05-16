// purpose:  implement the paginate method from the strategy base class. Goes to the next page.
//           Sorting is done by text weight and amount of matches with the user's query.

import { PaginationOptions } from "../helpers/pagination-options";
import { PaginationStrategy } from "./pagination-strategy-base";
import { ObjectId, Collection } from "mongodb";
import PaginationResult from "../helpers/pagination-result";
import { ProductModel } from "../../models/product-model";

export class TextNextPage extends PaginationStrategy {
  async paginate(
    options: PaginationOptions,
    productCollection: Collection<any>
  ) {
    let brand = options.brand!;
    let query = options.query!;

    // Write a basic 'featured' style query where we wiegh the words and their presence and sort by that instead
    let res = await productCollection
      .find({
        // find by matching keywords
        $text: { $search: `"${brand}" ${query}` },
        // pagination logic - UP
        // _id: { $gt: new ObjectId(options.uniqueKey) },
      })
      // required in the MongoDB Node driver to allow weighing results by # of keyword matches
      .project({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      // limit results
      .limit(4)
      // turn the limited results into an array
      .toArray();

    let products: ProductModel[] = res.map((productDocumnent) => {
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

    let textScore = res.map((productDocument) => {
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
