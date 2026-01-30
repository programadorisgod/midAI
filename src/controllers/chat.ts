import type { Request, Response } from "express";
import { getAIService } from "../utils/get-ai-service.js";
let currentIndex = 0;

export const chatController = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).send("Invalid request body");
    }

    const AIservice = getAIService();
    const stream = await AIservice.Chat(messages);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  } catch (e) {
    console.error("Error in chatController:", e);
    return res.status(500).send("Internal Server Error");
  }
};
