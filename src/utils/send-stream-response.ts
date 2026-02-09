import type { Response } from "express";

export const sendStreamResponse = async (
  res: Response,
  stream: AsyncGenerator<string, any, any>,
  currentIndexAIService: number,
  lengthAIService: number,
) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const metaData = `\n\n [META] Index: ${currentIndexAIService}, Total Services: ${lengthAIService}\n`;

  res.write(metaData);

  for await (const chunk of stream) {
    res.write(chunk);
  }

  res.end();
};
