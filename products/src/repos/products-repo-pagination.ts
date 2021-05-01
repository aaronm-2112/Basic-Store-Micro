// purpose: Create a factory method that will take a pagination options struct and return the correct
//          pagination query stratgey object to the calling method. This will make dictating which
//          query should be used for pagination simpler and more extensible.

import { PaginationOptions } from "./pagination-options";
//import { PriceNextPage } from "./pagination-strategies/price-next-page";
import { TextNextPagePagination } from "./pagination-strategies/text-next-page";
import { ProductsRepo } from "./products-repo-base";

// extend the products repo base class
export class ProductsRepoPagination extends ProductsRepo {
  constructor() {
    super();
  }
  // implement the createPaginationStratgey method
  createPaginationStrategy(options: PaginationOptions) {
    try {
      //      determine action based on the pagination options struct's sortMethod
      //          if sorthMethod == 'price - low-high'
      //              check if page is 'next' or 'previous'
      //                  return the correct paginationStrategy
      //          else if sorthMethod == 'price - high-low'
      //              check if page is 'next' or 'previous'
      //                  return the correct paginationStrategy
      //          else if sorthMethod == 'text'
      //              check if page is 'next' or 'previous'
      //                  return the correct paginationSratgey
      //          else if sorthMethod == 'date'
      //              check if page is 'next' or 'previous'
      //                  return the correct pagination strategy

      let r = new TextNextPagePagination();

      return r;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}

// export the class
