# TECHNICAL DOCUMENTATION

### How it works

What MID AI does is basically receive a request with an array of messages, and then iterate over a list of artificial intelligence services (Cerebras, Deepseek, Gemini, Groq, Open Router, etc.) until one of them can answer the user’s question or request. Each artificial intelligence service is implemented as a class following a common interface ('AIService'), which allows the controller ('chat.ts') to interact with them in a uniform manner.

## Architecture

```
midAI/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   │   └── chat.ts
│   ├── routes/
│   │   └── chat.ts
│   ├── services/
│   │   ├── cerebras/
│   │   │   └── cerebras.ts
│   │   ├── deepseek/
│   │   │   └── deepseek.ts
│   │   ├── gemini/
│   │   │   └── gemini.ts
│   │   ├── github/
│   │   │   └── github.ts
│   │   ├── groq/
│   │   │   └── groq.ts
│   │   └── open-router/
│   │       └── open-router.ts
│   ├── interfaces/
│   │   ├── ai-service.ts
│   │   └── messages.ts
│   └── utils/
│       ├── get-ai-service.ts
│       └── send-stream-response.ts

```

## flow of a request

```
Client -> HTTP POST /chat
  -> express router (`src/routes/chat.ts`)
    -> controller (`src/controllers/chat.ts`)
      -> validate body and iterate attempts:
         -> ask for next service with `getAIService()` (`src/utils/get-ai-service.ts`)
            ->  instance/uses an AIService `src/services/*/*`
               -> each `AIService.Chat(messages)` use your SDK to create a stream (async iterator)
                 -> controller calls `sendStreamResponse(res, stream, index, total, serviceName)` (`src/utils/send-stream-response.ts`)
                    -> responds to the client via SSE (meta, chunk, done, error)
```


## How to add a new AI service

1. Create a new file in the `src/services` directory for your AI service (e.g., `my-ai-service.ts`).
2. Implement the `AIService` interface in your new file. This includes defining the `
3. Chat(messages: Message[]): AsyncIterable<ChatResponse>` method, which should use the SDK of your AI service to create a stream of responses.
4. In the `src/utils/get-ai-service.ts` file, add a new case to the switch statement to return an instance of your new AI service when requested.
5. Make sure to handle any specific errors or edge cases related to your AI service in the controller (`src/controllers/chat.ts
