import { client } from "../client";
import { ProductModel } from "../models/product-model";
import { dbConfig } from "../config/database-config";

export class ProductsRepo {
  // get the products collection from the mongo client
  private productsCollection = client.getCollection(
    dbConfig.productsCollectionName
  );

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
        user: res.user,
      };

      // return the product model to the client
      return product;
    } catch (e) {
      throw new Error(e);
    }
  }

  // TODO: Enable pagination
  async findByCategory(category: string): Promise<Array<ProductModel>> {
    try {
      // search for 10 producs with the required category and return 10 results
      let productDocuments = await this.productsCollection!.find({
        category: category,
      })
        .limit(10)
        .toArray();

      // make the product documents product models
      let products = productDocuments.map((productDocumnent) => {
        return {
          name: productDocumnent.name,
          price: productDocumnent.price,
          description: productDocumnent.description,
          imageURI: productDocumnent.imageURI,
          category: productDocumnent.category,
          quantity: productDocumnent.quantity,
          user: productDocumnent.user,
        };
      });

      return products;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findByName(name: string): Promise<Array<ProductModel>> {
    try {
      // search for products that contain the given name using the text index
      let productDocuments = await this.productsCollection!.find({
        $text: { $search: name },
      })
        .limit(10)
        .toArray();

      // create an array of product models
      let products = productDocuments.map((productDocumnent) => {
        return {
          name: productDocumnent.name,
          price: productDocumnent.price,
          description: productDocumnent.description,
          imageURI: productDocumnent.imageURI,
          category: productDocumnent.category,
          quantity: productDocumnent.quantity,
          user: productDocumnent.user,
        };
      });

      return products;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findBySeller(sellerName: string): Promise<Array<ProductModel>> {
    try {
      // search for 10 producs with the required category and return 10 results
      let productDocuments = await this.productsCollection!.find({
        "user.username": sellerName,
      })
        .limit(10)
        .toArray();

      // make the product documents product models
      let products = productDocuments.map((productDocumnent) => {
        return {
          name: productDocumnent.name,
          price: productDocumnent.price,
          description: productDocumnent.description,
          imageURI: productDocumnent.imageURI,
          category: productDocumnent.category,
          quantity: productDocumnent.quantity,
          user: productDocumnent.user,
        };
      });

      return products;
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
}
