import type { Response } from "express";

export const sendStreamResponse = async (
  res: Response,
  stream: AsyncGenerator<string, any, any>,
) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  for await (const chunk of stream) {
    res.write(chunk);
  }

  res.end();
};
