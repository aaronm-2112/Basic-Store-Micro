import express from "express";
import { paginationRouter } from "./routes/product-pagination";

const app = express();

// register the routes
app.use(paginationRouter);

// setup cookie sessions

// setup the error handler method

export { app };
