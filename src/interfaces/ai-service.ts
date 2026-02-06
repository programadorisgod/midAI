import { Result } from "../utils/operation-result.js";
import { Message } from "./messages.js";

export type ChatErrors = {
  reason:
    | "INSUFFICIENT_BALANCE_ERROR"
    | "RESPONSE_UNDEFINED"
    | "TOO_MANY_REQUEST"
    | "UNKNOWN_ERROR";
};
export interface AIService {
  Chat(
    messages: Message[],
  ): Promise<Result<AsyncGenerator<string>, ChatErrors>>;
}
