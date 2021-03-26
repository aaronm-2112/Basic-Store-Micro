import express, { Request, Response } from "express";
import { validationResult, body } from "express-validator";
import bcrypt from "bcrypt";
import { AuthRepo } from "../repos/auth-repo";
import { createJWT } from "../services/jwt";

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
  async (req: Request, res: Response) => {
    // check if validation passes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //  if not send back a 400
      errors.array().forEach((element) => {
        //console.error(element);
      });
      return res.sendStatus(400);
    }

    // get the user information
    const { email, password } = req.body;

    // find the user in the user database
    const user = await AuthRepo.find(email);

    // check if the user does not exist
    if (!user) {
      return res.sendStatus(400);
    }

    // compare the password given by the user to their stored salted password
    const match = await bcrypt.compare(password, user.password);

    // if there isn't a match return a 400
    if (!match) {
      return res.sendStatus(400);
    }

    // create the user's session using a HMAC JWT -- TODO: Use RSA
    req.session = {
      jwt: createJWT(user.username, user.email),
    };

    res.sendStatus(200);
  }
);

export { router as signinRouter };
