import { app } from "./app";
import { Pool } from "./pool";
import migrate from "node-pg-migrate";

// TODO: Fix two problems:
//       1. Connect to an auth-micro database that may not always exist [Eventual WIP]
//       2. Run the migrations if there is no table [done]

(async () => {
  if (!process.env.PG_HOST) {
    throw new Error("No host detected");
  }

  if (!process.env.PG_DATABASE) {
    throw new Error("No database detected");
  }

  if (!process.env.PG_PASSWORD) {
    throw new Error("No password detected");
  }

  if (!process.env.PG_PORT) {
    throw new Error("No port detected");
  }

  if (!process.env.JWT_KEY) {
    throw new Error("No jwt secret key defined");
  }

  let PG_PORT = process.env.PG_PORT;

  // connect to postgres using the pool singleton
  const connectionResult = await Pool.connect({
    host: process.env.PG_HOST,
    port: parseInt(PG_PORT),
    database: "postgres",
    password: process.env.PG_PASSWORD,
    user: process.env.PG_USER,
  });

  // check if the connection was successful
  if (connectionResult.rows) {
    // check if the tables in the auth database have been set up or if we need to run a migration
    const runMigration = await Pool.query(
      `SELECT EXISTS (
      SELECT FROM pg_tables 
      WHERE schemaname='public' AND tablename = 'users'
    )`,
      []
    );

    if (runMigration) {
      // run the migrations
      await migrate({
        schema: "public",
        direction: "up",
        log: () => {},
        noLock: true,
        dir: "migrations",
        databaseUrl: {
          host: process.env.PG_HOST,
          port: parseInt(PG_PORT),
          database: "postgres",
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
        },
        migrationsTable: "pgmigrations", // experiment with this
        count: 1,
      });
    }
    app.listen(3000, () => {
      console.log(`Listening on port 3006`);
    });
  } else {
    throw new Error("Bad connection");
  }
})();

// docker build --tag aaronpazm/auth-store .
//docker run --publish 3000:3000 --env host=localhost -it aaronpazm/auth-store
