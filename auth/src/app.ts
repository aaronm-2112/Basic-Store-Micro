import express, { Request, Response } from "express";
import { signupRouter } from "./routes/signup";
import cookieSession from "cookie-session";

const app = express();

// TODO: Security additions
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60, // an hour long session
    secure: false, // TODO: Secure when running in Prod
    httpOnly: true, // Security measure to help prevent XSS
    keys: ["username", "email"],
  })
);

app.use(signupRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Root routes");
});

export { app };
