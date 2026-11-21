import "server-only";
import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { ZodType } from "zod";
import { getServerEnv } from "@/lib/server/env";

const memory = new Map<string, { expires: number; value: unknown }>();
function redisClient() {
  const env = getServerEnv();
  return env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN }) : null;
}
export function urlCacheKey(source: string, url: string) {
  const hash = createHash("sha256").update(url).digest("hex");
  return `scamshield:intel:${source}:${hash}`;
}
export async function cached<T>(key: string, schema: ZodType<T>): Promise<T | null> {
  try {
    const redis = redisClient();
    const value = redis ? await redis.get<unknown>(key) : memory.get(key)?.value;
    if (!redis && (memory.get(key)?.expires ?? 0) < Date.now()) return null;
    return value === null || value === undefined ? null : schema.parse(value);
  } catch {
    return null;
  }
}
export async function cacheValue(key: string, value: unknown, seconds = 3600) {
  try {
    const redis = redisClient();
    if (redis) await redis.set(key, value, { ex: seconds });
    else memory.set(key, { expires: Date.now() + seconds * 1000, value });
  } catch {
    return;
  }
}
