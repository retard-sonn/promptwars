import "server-only";
import { z } from "zod";

const optional = z.string().optional();
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  NEXT_PUBLIC_APP_URL: optional,
  GEMINI_API_KEY: optional,
  GEMINI_MODEL: optional,
  AWS_REGION: optional,
  AWS_ACCESS_KEY_ID: optional,
  AWS_SECRET_ACCESS_KEY: optional,
  AWS_SESSION_TOKEN: optional,
  BEDROCK_API_KEY: optional,
  BEDROCK_MODEL_ID: optional,
  BEDROCK_GUARDRAIL_ID: optional,
  BEDROCK_GUARDRAIL_VERSION: optional,
  GOOGLE_WEB_RISK_API_KEY: optional,
  URLHAUS_AUTH_KEY: optional,
  PHISHTANK_API_KEY: optional,
  OPENPHISH_FEED_URL: optional,
  VIRUSTOTAL_API_KEY: optional,
  ENABLE_SHORTENER_EXPANSION: optional,
  UPSTASH_REDIS_REST_URL: optional,
  UPSTASH_REDIS_REST_TOKEN: optional,
  IP_HASH_PEPPER: optional,
  MESSAGE_HASH_PEPPER: optional,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional,
  TURNSTILE_SECRET_KEY: optional,
  NEXT_PUBLIC_SUPABASE_URL: optional,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optional,
  SUPABASE_SERVICE_ROLE_KEY: optional,
  NEXT_PUBLIC_SENTRY_DSN: optional,
  NEXT_PUBLIC_POSTHOG_KEY: optional,
  NEXT_PUBLIC_POSTHOG_HOST: optional,
  POSTHOG_API_KEY: optional,
  POSTHOG_HOST: optional,
});
export type ServerEnv = z.infer<typeof envSchema>;
export function getServerEnv(): ServerEnv {
  return envSchema.parse(process.env);
}
