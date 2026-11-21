import "server-only";
import { z } from "zod";
import type { ThreatResult } from "@/lib/contracts/report";
import { getServerEnv } from "@/lib/server/env";
import { errorReason, threatFetch, unavailable } from "./http";

const responseSchema = z.object({
  threat: z
    .object({
      threatTypes: z.array(z.string()).optional(),
      expireTime: z.string().datetime().optional(),
    })
    .optional(),
});
export async function checkWebRisk(url: string): Promise<ThreatResult> {
  const source = "Google Web Risk" as const;
  const key = getServerEnv().GOOGLE_WEB_RISK_API_KEY;
  if (!key) return unavailable(source, "Not configured. No request was sent.");
  try {
    const query = new URLSearchParams({ uri: url, key });
    for (const type of ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"])
      query.append("threatTypes", type);
    const response = await threatFetch(
      `https://webrisk.googleapis.com/v1/uris:search?${query.toString()}`,
    );
    if (!response.ok)
      return unavailable(source, `The source returned HTTP ${response.status}.`);
    const data = responseSchema.parse(await response.json());
    return data.threat
      ? {
          source,
          status: "flagged",
          reason: "Google Web Risk reported a threat for this URL.",
          cacheUntil: data.threat.expireTime,
        }
      : {
          source,
          status: "clean",
          reason: "Google Web Risk returned no threat for this URL.",
        };
  } catch (error) {
    return unavailable(source, errorReason(error));
  }
}
