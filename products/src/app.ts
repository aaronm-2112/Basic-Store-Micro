import express from "express";
import { paginationRouter } from "./routes/product-pagination";
import { scaleRouter } from "./routes/scale";

const app = express();

// register the routes
app.use(paginationRouter);
app.use(scaleRouter);

// setup cookie sessions

// setup the error handler method

export { app };
