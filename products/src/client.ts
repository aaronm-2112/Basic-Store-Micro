// prupose: Create a mongo client singleton for the products repository and the Jest tests to utilize.

import { MongoClient, MongoClientOptions, Db } from "mongodb";

class Client {
  mc: MongoClient | undefined = undefined;
  db: Db | undefined = undefined;

  // connect the client to a mongodb server and the desired database
  async connect(
    uri: string,
    databaseName: string,
    options: MongoClientOptions | undefined
  ): Promise<boolean> {
    // check if the client is connected
    if (this.mc) {
      // if so cannot connect again so return undefined
      throw new Error("Client already connected");
    }

    // initialize the mongo client
    this.mc = new MongoClient(uri, options);

    // connect the mongo client to the database
    await this.mc.connect();

    // set the database this MongoClient will be using
    this.db = this.mc.db(databaseName);

    // TODO: Check if connection was successful
    return true;
  }

  // disconnect the client from the mongodb server
  async close() {
    // check if the mongo client has been connected
    if (!this.mc) {
      console.error(
        "Cannot disconnect the mongo client before it has been connected to a mongodb server."
      );
      return;
    }
    this.mc.close();
  }

  // get a collection from the database
  getCollection(collectionName: string) {
    if (!this.db) {
      console.error(
        "Cannot get a collection before connecting to the mongodb server."
      );
      return;
    }
    return this.db!.collection(collectionName);
  }

  // get the current database instance from the client
  getDatabase() {
    if (!this.db) {
      console.error(
        "Cannot get a database instance before connecting to the mongodb server."
      );
      return;
    }

    return this.db;
  }
}

let c: Client = new Client();

export { c as client };
