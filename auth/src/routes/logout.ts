import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/auth/logout", async (req: Request, res: Response) => {
  // delete the current session
  req.session = null;

  console.log(req.session);

  res.sendStatus(200);
});

export { router as logoutRouter };
