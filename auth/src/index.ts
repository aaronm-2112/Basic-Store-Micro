import { app } from "./app";
import { Pool } from "./pool";

(async () => {
  if (!process.env.HOST) {
    throw new Error("No host detected");
  }

  if (!process.env.DATABASE) {
    throw new Error("No database detected");
  }

  if (!process.env.PASSWORD) {
    throw new Error("No password detected");
  }

  const PORT = process.env.port || 3000;

  // connect to postgres using the pool singleton
  const connectionResult = await Pool.connect({
    host: process.env.HOST,
    port: 5432,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });

  // check if the connection was successful
  if (connectionResult.rows) {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } else {
    throw new Error("Bad connection");
  }
})();

// docker build --tag aaronpazm/auth-store .
//docker run --publish 3000:3000 --env host=localhost -it aaronpazm/auth-store
