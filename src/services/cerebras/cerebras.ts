import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { AIService } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";

import { config } from "dotenv";
config();

const cerebras = new Cerebras();

export class CerebrasService implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    const stream = await cerebras.chat.completions.create({
      messages,
      model: "zai-glm-4.7",
      stream: true,
      max_completion_tokens: 65000,
      temperature: 1,
      top_p: 0.95,
    });

    return (async function* () {
      for await (const chunk of stream) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    })();
  }
}
