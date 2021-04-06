import express, { Request, Response } from "express";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { currentuserRouter } from "./routes/current-user";
import { logoutRouter } from "./routes/logout";
import { errorHandler } from "./middlewares/error-handler";
import cookieSession from "cookie-session";
import { UnauthorizedError } from "./errors/unauthorized-error";
//import { UnauthorizedError } from "../errors/unauthorized-error";

const app = express();

//Security TODOS:
//     - Same site
//     - Double submit CSRF tokens for stateless CSRF protection
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60, // an hour long session
    secure: false, // TODO: Secure when running in Prod
    httpOnly: true, // Security measure to help prevent XSS attempts to steal a user's session
    keys: ["username", "email"],
    // sameSite: true,
    //  To do this, I need to add the Host statement in
    //  the Ingress yaml[ i believ host value should mathc the
    //  ingress-nginx-controller Service's External IP or can be a
    //  different value if in the host file I convert a different
    //  domain name (like microstore.dev) to localhost]
  })
);

app.use(signupRouter);
app.use(signinRouter);
app.use(currentuserRouter);
app.use(logoutRouter);

app.get("*", (req: Request, res: Response) => {
  throw new UnauthorizedError("Not allowed here");
});

app.use(errorHandler);

export { app };
