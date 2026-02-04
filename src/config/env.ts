import z from "zod";

const enviroment_variables = z.object({
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  CEREBRAS_API_KEY: z.string().min(1, "CEREBRAS_API_KEY is required"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  OPEN_ROUTER_KEY: z.string().min(1, "OPEN_ROUTER_KEY is required"),
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
