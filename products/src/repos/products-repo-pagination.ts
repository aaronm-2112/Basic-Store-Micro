// purpose: Create a factory method that will take a pagination options struct and return the correct
//          pagination query stratgey object to the calling method. This will make dictating which
//          query should be used for pagination simpler and more extensible.

import { PaginationOptions } from "../pagination/helpers/pagination-options";
import { PriceNextPage } from "../pagination/pagination-strategies/price-next-page";
import { PricePreviousPage } from "../pagination/pagination-strategies/price-previous-page";
//import { PriceNextPage } from "./pagination-strategies/price-next-page";
import { TextNextPage } from "../pagination/pagination-strategies/text-next-page";
import { TextPreviousPage } from "../pagination/pagination-strategies/text-previous-page";
import { ProductsRepo } from "./products-repo-base";
import { sortMethods } from "./sort-methods";

// extend the products repo base class
export class ProductsRepoPagination extends ProductsRepo {
  constructor() {
    super();
  }
  // implement the createPaginationStratgey method
  createPaginationStrategy(options: PaginationOptions) {
    try {
      // determine action based on the pagination options struct's sortMethod
      switch (options.sortMethod) {
        case sortMethods.TEXT:
          // check if page is 'next' or 'previous'
          return options.page === "next"
            ? new TextNextPage()
            : new TextPreviousPage();

        case sortMethods.PRICE_LOW_TO_HIGH:
          //  check if page is 'next' or 'previous'
          return options.page === "next"
            ? new PriceNextPage()
            : new PricePreviousPage();

        default:
          throw new Error("Not a valid pagination stratgey");
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
