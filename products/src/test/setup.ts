import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db } from "mongodb";
import { up } from "migrate-mongo";

let mongo: any;
let mc: MongoClient;
let db: Db;

// a hook
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  process.env.NODE_ENV = "test";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  let mc = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await mc.connect();

  db = mc.db("products-micro-test");

  // run the migrations up
  await up(db);
});

// clean the db data before each test
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mc.db("products-micro-test").collections();

  for (let collection of collections) {
    await collection.deleteMany({});
    // recreate the index after cleaning our slate
    await collection.reIndex();
  }
});

afterAll(async () => {
  await mongo.stop(); // this should get rid of the in memory data stores based of the documentation - meaning I don't need to run down
  await mc.close();
});
