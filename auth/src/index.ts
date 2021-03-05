import { app } from "./app";
import { Pool } from "./pool";

(async () => {
  // connect to postgres using the pool singleton
  const connectionResult = await Pool.connect({
    host: "localhost",
    port: 5432,
    database: "auth",
    password: "password",
  });

  // check if the connection was successful
  if (connectionResult.rows) {
    app.listen("3000", async () => {
      console.log("Listening on port 3000");
    });
  } else {
    throw new Error("Bad connection");
  }
})();
