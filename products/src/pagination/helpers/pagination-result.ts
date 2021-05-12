// prupose: An interface that defines the structure of the results from a pagination request

import { ProductModel } from "../../models/product-model";

// the list of products and an optional text score field that defines the text relevancy of the results
// used for sorting by text relevancy.
export default interface PaginationResult {
  products: ProductModel[];
  textScore?: number[];
}
