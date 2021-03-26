import express, { Request, Response } from "express";
import { validationResult, body } from "express-validator";
import { createJWT } from "../services/jwt";
import { AuthRepo } from "../repos/auth-repo";
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

    try {
      // grab username, email, and password fromt the request
      const { email, username, password } = req.body;

      // check if that user already existsß
      const existingUser = await AuthRepo.find(email);
      if (existingUser) {
        //  if user already exists send back a 400
        return res.sendStatus(400);
      }

      // create the user
      const user = await AuthRepo.create(username, email, password);

      // create the user's session using a HMAC JWT -- TODO: Use RSA
      req.session = {
        jwt: createJWT(user.username, user.email),
      };

      // send back a 201 k
      return res.status(201).send(user);
    } catch (e) {
      console.error(e);
      return res.sendStatus(400);
    }
  }
);

export { router as signupRouter };
