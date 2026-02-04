import OpenAI from "openai";
import { AIService } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { env } from "../../config/env.js";
import { InsufficientBalanceError } from "../../utils/error.js";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: env.DEEPSEEK_API_KEY,
});

const MODEL = "deepseek-chat";

export class DeepSeekService implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    try {
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: MODEL,
        stream: true,
      });

      return (async function* () {
        for await (const chunk of completion) {
          yield chunk.choices[0].delta?.content || "";
        }
      })();
    } catch (err: any) {
      if (err?.status === 402) {
        throw new InsufficientBalanceError("DeepSeek");
      }
      throw err;
    }
  }
}
