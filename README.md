# MID AI

MID AI is a project created from the need to have a tool that would allow me to have an artificial intelligence API for university projects, prototypes or personal small projects, but quickly, No registration, no need to associate my credit card and so on.


## Quick start

1. Clone the repository
2. Install the dependencies with your package manager of choice (pnpm, bun or npm)
3. set up your environment variables in a .env file (see .env.example for reference)
4. Start the server with `pnpm run dev` or `bun run dev` or `npm run dev`




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




## Technologies used

- Node.js
- Express.js
- TypeScript
- dotenvx
- OpenAI SDK
- Microsoft Foundary Inference SDK


# Technical details

For more technical details about the project, you can tech the [TECHNICAL.md](./TECHNICAL.md) file.
