// purpose: Define different pagination algorithms for paginating by text, price, and date.

import { ProductModel } from "../../models/product-model";
import { PaginationOptions } from "../helpers/pagination-options";
import { Collection } from "mongodb";
import PaginationResult from "../helpers/pagination-result";

export abstract class PaginationStrategy {
  private products: any[];

  constructor() {
    this.products = [];
  }

  // declare an abstract paginate method that takes a set of pagination options via the PaginationOptions struct
  abstract paginate(
    options: PaginationOptions,
    products: Collection<any>
  ): Promise<void>;

  getPaginationResult(): PaginationResult {
    let products: ProductModel[] = this.products.map((productDocumnent) => {
      return {
        id: productDocumnent._id,
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

    let textScore = this.products.map((productDocument) => {
      return productDocument.score;
    });

    // create the pgaination result object
    let results: PaginationResult = {
      products,
      textScore,
    };

    return results;
  }

  protected setPageOfProducts(products: any[]) {
    this.products = products;
  }

  protected buildPaginationQuery(options: PaginationOptions): string {
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

    return finalQuery;
  }
}
