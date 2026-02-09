import { Result } from "../utils/operation-result.js";
import { Message } from "./messages.js";
import { AIProvider } from "./provider.js";

export type ChatErrors = {
  reason:
    | "INSUFFICIENT_BALANCE_ERROR"
    | "RESPONSE_UNDEFINED"
    | "TOO_MANY_REQUEST"
    | "UNKNOWN_ERROR";
};

export interface AIService {
  readonly provider: AIProvider;
  Chat(
    messages: Message[],
    apiKeys?: Partial<Record<AIProvider, string>>,
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>>;
}
