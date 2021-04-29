import { app } from "./app";

// define an outer async method so setup can be performed

// check that all required environment variables are passed in
//  if any are undefined exit the application

//  connect to MongoDB using the Client singleton
//  check if connection was successful

//  connect to Redis
//  store all of the unique brands in the MongoDB database as a key value pair
//    Brand = key, Value = Boolean

// if all of the above is successful start listening
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
