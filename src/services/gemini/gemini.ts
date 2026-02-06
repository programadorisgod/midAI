import { GoogleGenAI } from "@google/genai";
import { AIService, ChatErrors } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { err, ok, Result } from "../../utils/operation-result.js";
import { mapError } from "../../utils/mapped-error.js";

const ai = new GoogleGenAI({});
const MODEL = "gemini-3-flash-preview";

export class GoogleGenAIServices implements AIService {
  async Chat(
    messages: Message[],
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
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
