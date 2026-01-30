import { GoogleGenAI } from "@google/genai";
import { AIService } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";

const ai = new GoogleGenAI({});

export class GoogleGenAIServices implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: messages.map((msg) => msg.content),
    });

    return (async function* () {
      for await (const chunk of response) {
        yield chunk.text || "";
      }
    })();
  }
}
