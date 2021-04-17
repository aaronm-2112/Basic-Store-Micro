import { MongoMemoryServer } from "mongodb-memory-server";
import { client } from "../client";
import { up } from "migrate-mongo";

// purpose: allow for parallel testing with Jest using the singleton mongo client and a mongo memory server

// the mongo memory server we connect our client to for tests
let mongo: any;

// connect our client to the mongo memory server before any tests run in a test file
export async function connectToTestDatabase(databaseName: string) {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await client.connect(mongoUri, databaseName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// run the database migrations on the mongo memory server before any tests run in a test file
export async function runMigrationsOnTestDatabase() {
  // get the database instance from the singelton mongo client
  let db = client.getDatabase();

  // check if the database is defined
  if (!db) {
    console.error("No database returned in runMigrationOnTestDatabase");
    return;
  }
  // run the migrations on the singletons db instance
  await up(db);
}

// clean the db data before each test using the client
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await client.getDatabase()!.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
    // recreate the index after cleaning our slate
    await collection.reIndex();
  }
});

// after all tests are done disconnect from the test database and close the client connection
afterAll(async () => {
  await mongo.stop(); // this should get rid of the in memory data stores based of the documentation - meaning I don't need to run down
  await client.close();
});
