import { Groq } from "groq-sdk";
import { Message } from "../../interfaces/messages.js";
import { AIService } from "../../interfaces/ai-service.js";

const groq = new Groq();
const MODEL = "moonshotai/kimi-k2-instruct-0905";

export class GroqService implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 1,
      stream: true,
      stop: null,
    });

    return (async function* () {
      for await (const chunk of chatCompletion) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    })();
  }
}
