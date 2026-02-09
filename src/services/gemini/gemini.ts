import { GoogleGenAI } from "@google/genai";
import { AIService, ChatErrors } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { err, ok, Result } from "../../utils/operation-result.js";
import { mapError } from "../../utils/mapped-error.js";
import { env } from "../../config/env.js";
import { AIProvider } from "../../interfaces/provider.js";

const MODEL = "gemini-3-flash-preview";

export class GoogleGenAIServices implements AIService {
  readonly provider: AIProvider = "gemini";
  async Chat(
    messages: Message[],
    apiKeys?: Partial<Record<AIProvider, string>>,
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
    const ai = new GoogleGenAI({
      apiKey: apiKeys?.gemini || env.GEMINI_API_KEY,
    });

    try {
      const response = await ai.models.generateContentStream({
        model: MODEL,
        contents: messages.map((msg) => msg.content),
      });

      const generator = (async function* () {
        for await (const chunk of response) {
          yield chunk.text || "";
        }
      })();
      return ok(generator);
    } catch (e: any) {
      const mapped = mapError<ChatErrors>(e, "GoogleGenAI");
      return err(mapped as ChatErrors);
    }
  }
}
