import { OpenRouter } from "@openrouter/sdk";
import { AIService } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { env } from "../../config/env.js";

const openRouter = new OpenRouter({
  apiKey: env.OPEN_ROUTER_KEY,
});
const MODEL = "openai/gpt-oss-120b:free";

export class OpenRouterService implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    const completion = await openRouter.chat.send({
      model: MODEL,
      messages,
      stream: true,
      streamOptions: {
        includeUsage: true,
      },
    });

    return (async function* () {
      for await (const chunk of completion) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    })();
  }
}
