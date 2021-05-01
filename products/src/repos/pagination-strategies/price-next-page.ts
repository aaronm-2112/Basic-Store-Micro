import { PaginationOptions } from "../pagination-options";
import { PaginationStrategy } from "./pagination-strategy-base";
import { Collection, ObjectId } from "mongodb";

export class PriceNextPage extends PaginationStrategy {
  async paginate(options: PaginationOptions, products: Collection<any>) {
    let res = await products
      .find({
        // find by matching keywords
        $text: { $search: '"footwear" "Nike" Silica ' },
        // pagination logic - UP
        $or: [
          { price: { $gt: 8 } },
          {
            price: 8,
            _id: { $gt: new ObjectId(options.uniqueKey) },
          },
        ],
      })
      // sort logic
      .sort({
        price: -1,
      })
      // limit results
      .limit(4)
      // turn the limited results into an array
      .toArray();

    let productsArray = res.map((productDocumnent) => {
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

    return productsArray;
  }
}
