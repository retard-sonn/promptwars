import "server-only";
import { z } from "zod";
import type { ThreatResult } from "@/lib/contracts/report";
import { getServerEnv } from "@/lib/server/env";
import { errorReason, threatFetch, unavailable } from "./http";

const responseSchema = z.object({
  results: z.object({
    in_database: z.boolean(),
    verified: z.boolean().optional(),
    valid: z.union([z.boolean(), z.string()]).optional(),
  }),
});
export async function checkPhishTank(url: string): Promise<ThreatResult> {
  const source = "PhishTank" as const;
  const key = getServerEnv().PHISHTANK_API_KEY;
  if (!key) return unavailable(source, "Not configured. No request was sent.");
  try {
    const response = await threatFetch("https://checkurl.phishtank.com/checkurl/", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url, format: "json", app_key: key }).toString(),
    });
    if (!response.ok)
      return unavailable(source, `The source returned HTTP ${response.status}.`);
    const data = responseSchema.parse(await response.json()).results;
    const valid = data.valid === true || data.valid === "true";
    if (data.in_database && data.verified && valid)
      return {
        source,
        status: "flagged",
        reason: "PhishTank lists this as a verified phishing URL.",
      };
    if (!data.in_database)
      return {
        source,
        status: "clean",
        reason: "PhishTank returned no database record for this URL.",
      };
    return unavailable(
      source,
      "PhishTank has an unverified or inconclusive record for this URL.",
    );
  } catch (error) {
    return unavailable(source, errorReason(error));
  }
}
