import { randomBytes } from "crypto";
import { Pool } from "../pool";
import format from "pg-format";
import migrate from "node-pg-migrate";

const DEFAULT_OPTS = {
  host: process.env.TEST_HOST,
  port: 5432,
  database: process.env.TEST_DB,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
};

export default class Context {
  private roleName: string = "";

  constructor(roleName: string) {
    this.roleName = roleName;
  }

  static async build() {
    const roleName = "a" + randomBytes(4).toString("hex");
    let connected;
    // connect to PG as usual
    connected = await Pool.connect(DEFAULT_OPTS);

    // create a new role
    await Pool.query(
      format("CREATE ROLE %I WITH LOGIN PASSWORD %L", roleName, roleName),
      []
    );

    // create a new schema in the database with the same name
    await Pool.query(
      format("CREATE SCHEMA %I AUTHORIZATION %I", roleName, roleName),
      []
    );

    // disconnect from PG
    await Pool.close();

    // run our migration inside of the new schema
    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: "localhost",
        port: 5432,
        database: "auth-test",
        user: roleName,
        password: roleName,
      },
      migrationsTable: "pgmigrations", // experiment with this
      count: 1,
    });

    // connect to PG as the newly created role
    connected = await Pool.connect({
      host: "localhost",
      port: 5432,
      database: "auth-test",
      user: roleName,
      password: roleName,
    });

    return new Context(roleName);
  }

  async close() {
    // disconnect from PG
    await Pool.close();

    // reconnect as our root user
    await Pool.connect(DEFAULT_OPTS);

    // delete the role and schema we created
    await Pool.query(format(`DROP SCHEMA %I CASCADE;`, this.roleName), []);

    await Pool.query(format(`DROP ROLE %I;`, this.roleName), []);

    // disconnect again
    await Pool.close();
  }

  async reset() {
    // add more delete statements when you get more tables
    return Pool.query(
      `
         DELETE FROM users; 
       `,
      []
    );
  }
}
