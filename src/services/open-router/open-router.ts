import { OpenRouter } from "@openrouter/sdk";
import { AIService, ChatErrors } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { env } from "../../config/env.js";
import { err, ok, Result } from "../../utils/operation-result.js";
import { mapError } from "../../utils/mapped-error.js";
import { resolveApiKey } from "../../utils/resolve-apikey.js";

const MODEL = "openai/gpt-oss-120b:free";

export class OpenRouterService implements AIService {
  async Chat(
    messages: Message[],
    apiKey?: string,
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
    const openRouter = new OpenRouter({
      apiKey: resolveApiKey("OPEN_ROUTER_KEY", apiKey),
    });

    try {
      const completion = await openRouter.chat.send({
        model: MODEL,
        messages,
        stream: true,
        streamOptions: {
          includeUsage: true,
        },
      });

      const generator = (async function* () {
        for await (const chunk of completion) {
          yield chunk.choices[0]?.delta?.content || "";
        }
      })();
      return ok(generator);
    } catch (e: any) {
      const mapped = mapError<ChatErrors>(e, "OpenRouter");
      return err(mapped as ChatErrors);
    }
  }
}
