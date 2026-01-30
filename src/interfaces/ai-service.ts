import { Message } from "./messages";

export interface AIService {
  Chat: (messages: Message[]) => Promise<AsyncGenerator<string>>;
}
