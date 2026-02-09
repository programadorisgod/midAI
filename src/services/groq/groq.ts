import { Groq } from "groq-sdk";
import { Message } from "../../interfaces/messages.js";
import { AIService, ChatErrors } from "../../interfaces/ai-service.js";
import { err, ok, Result } from "../../utils/operation-result.js";
import { mapError } from "../../utils/mapped-error.js";
import { env } from "../../config/env.js";
import { AIProvider } from "../../interfaces/provider.js";

const MODEL = "moonshotai/kimi-k2-instruct-0905";

export class GroqService implements AIService {
  readonly provider: AIProvider = "groq";
  async Chat(
    messages: Message[],
    apiKeys?: Partial<Record<AIProvider, string>>,
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
    const groq = new Groq({
      apiKey: apiKeys?.groq || env.GROQ_API_KEY,
    });

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: MODEL,
        temperature: 0.6,
        max_completion_tokens: 4096,
        top_p: 1,
        stream: true,
        stop: null,
      });

      const generator = (async function* () {
        for await (const chunk of chatCompletion) {
          yield chunk.choices[0]?.delta?.content || "";
        }
      })();

      return ok(generator);
    } catch (e: any) {
      const mapped = mapError<ChatErrors>(e, "Groq");
      return err(mapped as ChatErrors);
    }
  }
}
