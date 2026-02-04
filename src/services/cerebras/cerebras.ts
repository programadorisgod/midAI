import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { AIService } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";

const cerebras = new Cerebras();
const MODEL = "zai-glm-4.7";

export class CerebrasService implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    const stream = (await cerebras.chat.completions.create({
      messages,
      model: MODEL,
      stream: true,
      max_completion_tokens: 65000,
      temperature: 1,
      top_p: 0.95,
    })) as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>;

    return (async function* () {
      for await (const chunk of stream) {
        const content = chunk?.choices?.[0]?.delta?.content ?? "";
        yield content;
      }
    })();
  }
}
