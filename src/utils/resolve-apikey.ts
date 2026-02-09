import { env } from "../config/env";

export const resolveApiKey = (envVarName: string, apiKey?: string): string => {
  const key = apiKey || env[envVarName as keyof typeof env];

  if (!key) {
    throw new Error(`Missing API key (${envVarName})`);
  }

  return key as string;
};
