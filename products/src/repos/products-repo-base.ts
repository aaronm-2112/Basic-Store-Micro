import { client } from "../client";
import { ProductModel } from "../models/product-model";
import { dbConfig } from "../config/database-config";
import { PaginationOptions } from "../pagination/helpers/pagination-options";
import { PaginationStrategy } from "../pagination/pagination-strategies/pagination-strategy-base";

export abstract class ProductsRepo {
  // the products collection from the database
  protected productsCollection;

  constructor() {
    try {
      this.productsCollection = client.getCollection(
        dbConfig.productsCollectionName
      );
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  // create a product in the products database and get back a product ID
  async create(pm: ProductModel): Promise<string> {
    try {
      // insert the product into the collection
      let res = await this.productsCollection!.insertOne(pm);

      // get the id of the inserted product
      let insertedId = res.insertedId;

      // return the id to the client
      return insertedId;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(id: string): Promise<ProductModel | undefined> {
    try {
      // search for the product by id
      let res = await this.productsCollection!.findOne({ _id: id });

      // check if no product is found
      if (!res) {
        // return undefined
        return undefined;
      }

      // create the product model using the document data
      let product: ProductModel = {
        name: res.name,
        price: res.price,
        description: res.description,
        imageURI: res.imageURI,
        category: res.category,
        quantity: res.quantity,
        brand: res.brand,
        user: res.user,
      };

      // return the product model to the client
      return product;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateProduct(updatedProduct: ProductModel, id: string) {
    try {
      console.log(updatedProduct);
      // update the whole document using the passed in product
      let res = await this.productsCollection!.updateOne(
        { _id: id },
        {
          $set: {
            name: updatedProduct.name,
            price: updatedProduct.price,
            description: updatedProduct.description,
            category: updatedProduct.category,
            quantity: updatedProduct.quantity,
            imageURI: updatedProduct.imageURI,
            user: updatedProduct.user,
          },
        }
      );

      // ensure the update was successful
      if (!res.result.ok) {
        throw new Error("Could not update the product");
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteProduct(id: string) {
    try {
      let deleteResult = await this.productsCollection!.deleteOne({ _id: id });

      if (!deleteResult.result.ok) {
        throw new Error("No product to delete");
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async changeQuantity(id: string, up: boolean) {
    try {
      let updateValue;
      if (up) {
        updateValue = 1;
      } else {
        updateValue = -1;
      }

      // find the product by its id and increment it
      let document = await this.productsCollection!.updateOne(
        { _id: id },
        { $inc: { quantity: updateValue } }
      );

      // check the document to ensure it updated
      if (!document.result.ok) {
        throw new Error("Product not updated");
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  // Likely plan: Make a pagination strategy for the various different query variations I may need for pagination.
  //              Then add a factory in this method. The factory spits out the correct strategy object. We delegate to it.
  //              Then return the results.
  // search by name, category, or both name & category
  // sort by price, date, (eventually, reviews), or no sorting at all besides text weight(like Amazon's 'featured')
  // unique element is the ObjectId of each product - this will break ties

  // parameters:
  //   -category: any app defined category we have
  //   -productName: The name/set of words that define what the user is searching for
  //   -sortBy: The price or date the user wants to sort their search with.
  //   -sortByValue: The value used to get the next set of search results
  //   -uniqueKey: The object id of the product from which the sortByValue is derived. Used to break ties.
  //   -nextOrPrevious: Paginate up or paginate down

  // Will not return items in order by their ObjectIDs. It will be the job of the front end to get the highest and lowest ObjectIDs from the result set.
  // The front end will also send back the appropriate ID - Highest or lowest - depending upon the user's decision to page up or down.
  async samplePaginationQuery(options: PaginationOptions) {
    // pass the options into the createPaginationStratgey method
    // delegate the pagination to the strategy
    // return the resulting products to the callee
  }

  // createPaginationStratgey is an abstract method
  abstract createPaginationStrategy(
    options: PaginationOptions
  ): PaginationStrategy;
}

// check if a keyword in the query is a brand name -- this will be made a expression match in the text search portion of the query
function checkCacheForBrand(query: string) {
  // scan the query for brand keywords -- use a Redis cache to store all of the brand names for quick lookup time
  // scan through the query string
  //     check if a word is a brand name in the Redis cache
  //     if so return that word and stop -- this will be our brand
}
