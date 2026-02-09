import { type Request, type Response, Router } from "express";
import { ChatController } from "../controllers/chat.js";

const router = Router();

const PREFIX = "/chat";

router.post(`${PREFIX}`, (req: Request, res: Response) =>
  ChatController.Chat(req, res),
);

export { router as chatRouter };
