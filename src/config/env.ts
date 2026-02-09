import z from "zod";

const enviroment_variables = z.object({
  GROQ_API_KEY: z.string(),
  CEREBRAS_API_KEY: z.string(),
  GEMINI_API_KEY: z.string(),
  OPEN_ROUTER_KEY: z.string(),
  DEEPSEEK_API_KEY: z.string(),
  GITHUB_TOKEN: z.string(),
  PORT: z
    .string()
    .min(1)
    .transform((val: string) => parseInt(val, 10))
    .default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const { data, error, success } = enviroment_variables.safeParse(process.env);

if (!success) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

export const env = data;
