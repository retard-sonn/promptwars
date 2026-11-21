import "server-only";
import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getServerEnv } from "./env";

const buckets = new Map<string, number[]>();
let warned = false;
export type RateResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  source: "upstash" | "memory";
};
function memoryLimit(key: string, limit: number): RateResult {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((time) => now - time < 60000);
  const success = recent.length < limit;
  if (success) recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 1000) {
    for (const [bucket, times] of buckets) {
      if (!times.some((time) => now - time < 60000)) buckets.delete(bucket);
    }
    if (buckets.size > 1000) buckets.clear();
  }
  return {
    success,
    limit,
    remaining: Math.max(0, limit - recent.length),
    reset: now + 60000,
    source: "memory",
  };
}
export async function limitRequest(
  request: Request,
  userId?: string,
): Promise<RateResult> {
  const env = getServerEnv();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const identity =
    userId ??
    createHash("sha256")
      .update(`${env.IP_HASH_PEPPER ?? "development-only"}:${ip}`)
      .digest("hex");
  const limit = userId ? 30 : 10;
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, "60 s"),
      prefix: "scamshield:ratelimit",
    });
    const result = await ratelimit.limit(identity);
    return { ...result, source: "upstash" };
  }
  if (env.NODE_ENV === "development" && !warned) {
    console.warn(
      "Upstash is not configured. Rate limiting uses per-process memory only.",
    );
    warned = true;
  }
  return memoryLimit(identity, limit);
}
