import express, { Request, Response } from "express";
import { body, validationResult, check } from "express-validator";
import { AuthRepo } from "../repos/auth-repo";
const router = express.Router();

router.post(
  "/api/auth/signup",
  [
    check("username")
      .trim()
      .isLength({ max: 30 })
      .withMessage("Username is not valid"),
    check("email").isEmail().withMessage("Email must be valid"),
    check("password")
      .trim()
      .isLength({ max: 30 })
      .notEmpty()
      .withMessage("Password is not valid"),
  ],
  async (req: Request, res: Response) => {
    // check if validation passes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //  if not send back a 400
      return res.send(400);
    }

    // grab username, email, and password fromt the request
    const { email, username, password } = req.body;

    // check if that user already existsß
    const user = await AuthRepo.find(email);
    if (user) {
      //  if not send back a 400
      return res.sendStatus(400);
    }

    // create the user

    // send back a 201
  }
);
