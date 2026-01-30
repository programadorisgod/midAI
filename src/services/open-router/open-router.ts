import { OpenRouter } from "@openrouter/sdk";
import { AIService } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";

const openRouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_KEY,
});

export class OpenRouterService implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    const completion = await openRouter.chat.send({
      model: "openai/gpt-oss-120b:free",
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
