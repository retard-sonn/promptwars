import "server-only";
import { getServerEnv } from "@/lib/server/env";
import { BedrockProvider } from "./bedrock";
import { GeminiProvider } from "./gemini";
import type { LlmProvider } from "./schemas";

export function getLlmProvider(): LlmProvider | null {
  const env = getServerEnv();
  if (env.BEDROCK_MODEL_ID && env.AWS_REGION && (env.BEDROCK_API_KEY || (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY))) return new BedrockProvider(env);
  if (env.GEMINI_API_KEY && env.GEMINI_MODEL) return new GeminiProvider(env);
  return null;
}
