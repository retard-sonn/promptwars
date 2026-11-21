import "server-only";
import {
  threatResultSchema,
  type ThreatResult,
  type UrlThreat,
} from "@/lib/contracts/report-types";
import { cached, cacheValue, urlCacheKey } from "./cache";
import { checkOpenPhish } from "./openphish";
import { checkPhishTank } from "./phishtank";
import { checkUrlhaus } from "./urlhaus";
import { checkVirusTotal } from "./virustotal";
import { checkWebRisk } from "./web-risk";
import { unavailable } from "./http";

const adapters = [
  checkWebRisk,
  checkUrlhaus,
  checkPhishTank,
  checkOpenPhish,
  checkVirusTotal,
] as const;
const sources: ThreatResult["source"][] = [
  "Google Web Risk",
  "URLhaus",
  "PhishTank",
  "OpenPhish",
  "VirusTotal",
];
function publicUrl(raw: string) {
  try {
    const url = new URL(raw);
    url.username = "";
    url.password = "";
    url.hash = "";
    return url.toString();
  } catch {
    return raw;
  }
}
async function checkWithCache(adapter: (typeof adapters)[number], url: string) {
  const source = sources[adapters.indexOf(adapter)] ?? "OpenPhish";
  const key = urlCacheKey(source, url);
  const existing = await cached(key, threatResultSchema);
  if (existing) return existing;
  const result = await adapter(url);
  const cacheSeconds = result.cacheUntil
    ? Math.floor((Date.parse(result.cacheUntil) - Date.now()) / 1000)
    : 3600;
  if (result.status !== "unavailable" && cacheSeconds > 0)
    await cacheValue(key, result, Math.min(3600, cacheSeconds));
  return result;
}
export async function runThreatChecks(rawUrls: string[]): Promise<UrlThreat[]> {
  const urls = rawUrls.slice(0, 5).map(publicUrl);
  return Promise.all(
    urls.map(async (url) => {
      const settled = await Promise.allSettled(
        adapters.map((adapter) => checkWithCache(adapter, url)),
      );
      const results = settled.map((result, index) =>
        result.status === "fulfilled"
          ? result.value
          : unavailable(sources[index] ?? "OpenPhish", "The source adapter failed."),
      );
      return { url, results };
    }),
  );
}
