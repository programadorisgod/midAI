import { AzureKeyCredential } from "@azure/core-auth";
import { AIService, ChatErrors } from "../../interfaces/ai-service";
import { Message } from "../../interfaces/messages";
import ModelClient from "@azure-rest/ai-inference";
import { createSseStream } from "@azure/core-sse";
import { err, ok, Result } from "../../utils/operation-result";
import { mapError } from "../../utils/mapped-error";
import { env } from "../../config/env";
import { AIProvider } from "../../interfaces/provider";

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

let currentModel = 0;
const DONE = "[DONE]";

export class GitHubService implements AIService {
  readonly provider: AIProvider = "github";
  async Chat(
    messages: Message[],
    apiKeys?: Partial<Record<AIProvider, string>>,
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
    try {
      const TOKEN = apiKeys?.github || env.GITHUB_TOKEN;

      const client = ModelClient(ENDPOINT, new AzureKeyCredential(TOKEN));
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
        return err({ reason: "RESPONSE_UNDEFINED" });
      }
      const sseStream = createSseStream(response.body);

      const generator = (async function* () {
        for await (const event of sseStream) {
          if (event.data === DONE) {
            break;
          }
          var parsedData = JSON.parse(event.data);
          for (const choice of parsedData.choices) {
            yield choice.delta?.content ?? "";
          }
        }
      })();

      return ok(generator);
    } catch (e: any) {
      const mapped = mapError<ChatErrors>(e, "GitHub");
      return err(mapped as ChatErrors);
    }
  }
}
