import express, { Request, Response } from "express";
import "express-async-errors";
import { body } from "express-validator";
import { createJWT } from "../services/jwt";
import { AuthRepo } from "../repos/auth-repo";
import { ClientError } from "../errors/client-error";
import { validateInput } from "../middlewares/input-validation";
const router = express.Router();

router.post(
  "/api/auth/signup",
  [
    body("username")
      .trim()
      .isLength({ max: 30, min: 1 })
      .withMessage("Username is not valid"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ max: 30, min: 1 })
      .notEmpty()
      .withMessage("Password is not valid"),
  ],
  validateInput,
  async (req: Request, res: Response) => {

    // grab username, email, and password fromt the request
    const { email, username, password } = req.body;

    // check if that user already existsß
    const existingUser = await AuthRepo.find(email);
    if (existingUser) {
      //  if user already exists send back a 400
      throw new ClientError("Username unavailable");
    }

    // create the user
    const user = await AuthRepo.create(username, email, password);

    // create the user's session using a HMAC JWT -- TODO: Use RSA
    req.session = {
      jwt: createJWT(user.username, user.email),
    };

    // send back a 201
    return res.status(201).send(user);
  }
);

export { router as signupRouter };
