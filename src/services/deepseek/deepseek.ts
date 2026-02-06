import OpenAI from "openai";
import { AIService, ChatErrors } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { env } from "../../config/env.js";
import { err, ok, Result } from "../../utils/operation-result.js";
import { mapError } from "../../utils/mapped-error.js";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: env.DEEPSEEK_API_KEY,
});

const MODEL = "deepseek-chat";

export class DeepSeekService implements AIService {
  async Chat(
    messages: Message[],
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
    try {
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: MODEL,
        stream: true,
      });

      const generator = (async function* () {
        for await (const chunk of completion) {
          yield chunk.choices[0].delta?.content || "";
        }
      })();
      return ok(generator);
    } catch (e: any) {
      const mapped = mapError<ChatErrors>(e, "DeepSeek");
      return err(mapped as ChatErrors);
    }
  }
}
