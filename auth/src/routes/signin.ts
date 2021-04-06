import express, { Request, Response } from "express";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { AuthRepo } from "../repos/auth-repo";
import { createJWT } from "../services/jwt";
import { ClientError } from "../errors/client-error";
import { validateInput } from "../middlewares/input-validation";

const router = express.Router();

router.post(
  "/api/auth/signin",
  [
    body("email")
      .trim()
      .isLength({ max: 30, min: 1 })
      .isEmail()
      .withMessage("Email is not valid"),
    body("password")
      .trim()
      .isLength({ max: 30, min: 1 })
      .notEmpty()
      .withMessage("Password is not valid"),
  ],
  validateInput,
  async (req: Request, res: Response) => {
    // get the user information
    const { email, password } = req.body;

    // find the user in the user database
    const user = await AuthRepo.find(email);

    // check if the user does not exist
    if (!user) {
      throw new ClientError(
        "There is something wrong with your email or password."
      );
    }

    // compare the password given by the user to their stored salted password
    const match = await bcrypt.compare(password, user.password);

    // if there isn't a match return a 400
    if (!match) {
      throw new ClientError(
        "There is something wrong with your email or password."
      );
    }

    // create the user's session using a HMAC JWT -- TODO: Use RSA
    req.session = {
      jwt: createJWT(user.username, user.email),
    };

    res.sendStatus(200);
  }
);

export { router as signinRouter };
