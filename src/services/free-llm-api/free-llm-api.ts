import OpenAI from "openai";
import { AIService, ChatErrors } from "../../interfaces/ai-service.js";
import { Message } from "../../interfaces/messages.js";
import { err, ok, Result } from "../../utils/operation-result.js";
import { mapError } from "../../utils/mapped-error.js";
import { env } from "../../config/env.js";
import { AIProvider } from "../../interfaces/provider.js";

const MODEL = "auto";

export class FreeLlmApiService implements AIService {
    readonly provider: AIProvider = "freellmapi";

    async Chat(
        messages: Message[],
        apiKeys?: Partial<Record<AIProvider, string>>,
    ): Promise<Result<AsyncGenerator<string>, ChatErrors>> {
        const openai = new OpenAI({
            baseURL: env.FREE_LLM_API_ENDPOINT,
            apiKey: apiKeys?.freellmapi || env.FREE_LLM_API_KEY,
        });
        try {
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: MODEL,
                stream: true,
            });

            const generator = (async function* () {
                for await (const chunk of completion) {
                    yield chunk.choices[0].delta?.content || "";
                }
            })();
            return ok(generator);
        } catch (e: any) {
            console.log("e", e);
            const mapped = mapError<ChatErrors>(e, "FreeLlmApi");
            return err(mapped as ChatErrors);
        }
    }
}
