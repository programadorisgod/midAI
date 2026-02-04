import { Message } from "./messages.js";

export interface AIService {
  Chat(messages: Message[]): Promise<AsyncGenerator<string>>;
}
