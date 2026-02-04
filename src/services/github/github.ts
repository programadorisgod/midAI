import { AzureKeyCredential } from "@azure/core-auth";
import { env } from "../../config/env";
import { AIService } from "../../interfaces/ai-service";
import { Message } from "../../interfaces/messages";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { createSseStream } from "@azure/core-sse";

const MODELS = [
  "openai/gpt-4o-mini",
  "openai/gpt-4o",
  "openai/gpt-4.1-mini",
  "microsoft/Phi-4-mini-instruct",
  "mistral-ai/Ministral-3B",
  "xai/grok-3-mini",
  "deepseek-ai/DeepSeek-R1",
];

const ENDPOINT = "https://models.github.ai/inference";
const TOKEN = env.GITHUB_TOKEN;
const client = ModelClient(ENDPOINT, new AzureKeyCredential(TOKEN));
let currentModel = 0;

export class GitHubService implements AIService {
  async Chat(messages: Message[]): Promise<AsyncGenerator<string>> {
    const modelName = MODELS[currentModel];
    currentModel = (currentModel + 1) % MODELS.length;

    const response = await client
      .path("/chat/completions")
      .post({
        body: {
          messages,
          temperature: 1.0,
          top_p: 1.0,
          max_tokens: 1000,
          model: modelName,
          stream: true,
        },
      })
      .asNodeStream();

    if (!response.body) {
      throw new Error("The response is undefined");
    }
    const sseStream = createSseStream(response.body);

    return (async function* () {
      for await (const event of sseStream) {
        if (event.data === "[DONE]") {
          break;
        }
        var parsedData = JSON.parse(event.data);
        for (const choice of parsedData.choices) {
          yield choice.delta?.content ?? "";
        }
      }
    })();
  }
}
