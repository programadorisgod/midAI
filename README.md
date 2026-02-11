# MID AI

MID AI is a project created from the need to have a tool that would allow me to have an artificial intelligence API for university projects, prototypes or personal small projects, but quickly, No registration, no need to associate my credit card and so on.


> [!IMPORTANT]: The project is designed for prototypes and academic/personal use, so it may not be suitable for production environments or high-demand applications without further modifications and optimizations.


## Quick start

1. Clone the repository
2. Install the dependencies with your package manager of choice (pnpm, bun or npm)
3. set up your environment variables in a .env file (see .env.example for reference)
4. Once you have installed the dependencies and configured the environment variables, encrypt your environment variables using the command `pnpm run encrypt` o `bun run encrypt` o `npm run encrypt` which will handle encrypting your environment variables using dotenvx encrypt.
5. Start the server with `pnpm run dev` or `bun run dev` or `npm run dev`


### Example request

```curl
 curl -X POST http://localhost:3000/chat \
 -H 'Content-Type: application/json' \
 -d '{
    "messages": [
    {
      "role": "user",
     "content": "What is the capital of France?"
    }
   ]
}'
```


## Suppliers and links

Here are the suppliers mentioned and their official pages:

    Cerebras: https://www.cerebras.ai/
    OpenRouter: https://openrouter.ai/
    AI Studio (Google Gemini): https://aistudio.google.com/
    Groq: https://groq.com/
    


## Configuration of suppliers

You can configure providers using environment variables. Examples of suggested variable names (adjust to your needs or the internal package configuration):

    «GITHUB_TOKEN` - GitHub personal token (recommended if you want many models).
    «GEMINI_API_KEY» -Credential for AI Studio (if applicable).
    «CEREBRAS_API_KEY» - Credential for Cerebras.
    «OPEN_ROUTER_KEY» - Credential for OpenRouter.
    «GROQ_API_KEY» - Credential for Groq.


> [!TIP]
> If you want to avoid setting up providers, running and keeping the server active, you can use the "sdk" that I have created, so you simply do: 

```bash 
//pnpm, bun o npm
npm install @camidevv/mid-ai
```

```javascript
import { MidAI } from '@camidevv/mid-ai';
const midAI = new MidAI({});

(async () => {
  const response = await midAI.chat("What's the date today?");
  for await (const chunk of response) {
    console.log(chunk);
  }
})();
```

You can learn more about the SDK at: https://www.npmjs.com/package/@camidevv/mid-ai


## Technologies used

- Node.js
- Express.js
- TypeScript
- dotenvx
- OpenAI SDK
- Microsoft Foundary Inference SDK


# Technical details

For more technical details about the project, you can tech the [TECHNICAL.md](./TECHNICAL.md) file.
