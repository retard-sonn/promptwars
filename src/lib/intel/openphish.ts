import "server-only";
import { z } from "zod";
import type { ThreatResult } from "@/lib/contracts/report";
import { getServerEnv } from "@/lib/server/env";
import { cached, cacheValue } from "./cache";
import { errorReason, threatFetch, unavailable } from "./http";

const feedSchema = z.array(z.string());
async function feed(url: string): Promise<string[]> {
  const key = "scamshield:openphish:feed";
  const existing = await cached(key, feedSchema);
  if (existing) return existing;
  const response = await threatFetch(url);
  if (!response.ok) throw new Error("Feed unavailable");
  const lines = (await response.text())
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 200000);
  const parsed = feedSchema.parse(lines);
  await cacheValue(key, parsed);
  return parsed;
}
export async function checkOpenPhish(url: string): Promise<ThreatResult> {
  const source = "OpenPhish" as const;
  const feedUrl = getServerEnv().OPENPHISH_FEED_URL;
  if (!feedUrl) return unavailable(source, "Not configured. No request was sent.");
  try {
    const entries = await feed(feedUrl);
    const target = url.replace(/\/$/, "");
    const flagged = entries.some((entry) => entry.replace(/\/$/, "") === target);
    return flagged
      ? {
          source,
          status: "flagged",
          reason: "OpenPhish lists this exact URL in its current cached feed.",
        }
      : {
          source,
          status: "clean",
          reason: "OpenPhish did not list this exact URL in its current cached feed.",
        };
  } catch (error) {
    return unavailable(source, errorReason(error));
  }
}
