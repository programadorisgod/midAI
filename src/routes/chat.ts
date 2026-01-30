import { type Request, type Response, Router } from "express";
import { chatController } from "../controllers/chat.js";

const router = Router();

const PREFIX = "/chat";

router.post(`${PREFIX}`, (req: Request, res: Response) =>
  chatController(req, res),
);

export { router as chatRouter };
