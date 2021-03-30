import express, { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

router.get("/api/auth/currentuser", async (req: Request, res: Response) => {
  // grab the jwt from the session object attached to the request
  const jwt = req.session!.jwt;

  // check if the jwt is null/undefined
  if (!jwt) {
    //  if so return 401
    return res.sendStatus(401);
  }
  // verify the jwt and extract the payload
  // TODO: Place into middleware to centralize this (it is used in decodeJWT as well for testing)
  let payload = jsonwebtoken.verify(jwt, "test-secret") as {
    email: string;
    username: string;
  };
  let { email, username } = payload;

  // return the email and username portions of the payload to the user
  res.status(200).send({ email, username });
});

export { router as currentuserRouter };
