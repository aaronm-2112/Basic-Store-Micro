import express, { Request, Response } from "express";

let router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send("Pinged");
});

export { router as scaleRouter };
