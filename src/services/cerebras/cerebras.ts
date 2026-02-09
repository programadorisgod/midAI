import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { AIService, ChatErrors } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { err, ok, Result } from "../../utils/operation-result.js";
import { mapError } from "../../utils/mapped-error.js";
import { env } from "../../config/env.js";
import { AIProvider } from "../../interfaces/provider.js";

const MODEL = "zai-glm-4.7";

export class CerebrasService implements AIService {
  readonly provider: AIProvider = "cerebras";
  async Chat(
    messages: Message[],
    apiKeys?: Partial<Record<AIProvider, string>>,
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
    try {
      const cerebras = new Cerebras({
        apiKey: apiKeys?.cerebras || env.CEREBRAS_API_KEY,
      });

      const stream = (await cerebras.chat.completions.create({
        messages,
        model: MODEL,
        stream: true,
        max_completion_tokens: 65000,
        temperature: 1,
        top_p: 0.95,
      })) as AsyncIterable<{
        choices?: Array<{ delta?: { content?: string } }>;
      }>;

      const generator = (async function* () {
        for await (const chunk of stream) {
          const content = chunk?.choices?.[0]?.delta?.content ?? "";
          yield content;
        }
      })();

      return ok(generator);
    } catch (e: any) {
      console.log("Cerebras error:", e);
      const mapped = mapError<ChatErrors>(e, "Cerebras");
      return err(mapped as ChatErrors);
    }
  }
}
