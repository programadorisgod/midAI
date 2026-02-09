import type { Request, Response } from "express";
import { getAIService, AIServicesLength } from "../utils/get-ai-service.js";
import { sendStreamResponse } from "../utils/send-stream-response.js";

export const chatController = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).send("Invalid request body");
    }

    const MAX_RETRIES = AIServicesLength;
    let lastReason: string | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const [AIservice, currentIndexAIService] = getAIService();

      const [error, stream] = await AIservice.Chat(messages);

      if (!error) {
        return sendStreamResponse(
          res,
          stream,
          currentIndexAIService,
          AIServicesLength,
        );
      }

      lastReason = error?.reason ?? null;

      if (lastReason === "UNKNOWN_ERROR") {
        break;
      }
    }

    return res
      .status(500)
      .send("An error occurred while processing your request");
  } catch (e) {
    console.error("Error in chatController:", e);
    return res.status(500).send("Internal Server Error");
  }
};
