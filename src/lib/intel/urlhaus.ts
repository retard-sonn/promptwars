import "server-only";
import { z } from "zod";
import type { ThreatResult } from "@/lib/contracts/report";
import { getServerEnv } from "@/lib/server/env";
import { errorReason, threatFetch, unavailable } from "./http";

const responseSchema = z.object({
  query_status: z.string(),
  url_status: z.string().optional(),
});
export async function checkUrlhaus(url: string): Promise<ThreatResult> {
  const source = "URLhaus" as const;
  const key = getServerEnv().URLHAUS_AUTH_KEY;
  if (!key) return unavailable(source, "Not configured. No request was sent.");
  try {
    const response = await threatFetch("https://urlhaus-api.abuse.ch/v1/url/", {
      method: "POST",
      headers: { "Auth-Key": key, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url }).toString(),
    });
    if (!response.ok)
      return unavailable(source, `The source returned HTTP ${response.status}.`);
    const data = responseSchema.parse(await response.json());
    if (data.query_status === "ok")
      return {
        source,
        status: "flagged",
        reason: "URLhaus has this URL in its database.",
      };
    if (data.query_status === "no_results")
      return {
        source,
        status: "clean",
        reason: "URLhaus returned no record for this URL.",
      };
    return unavailable(source, "URLhaus returned an inconclusive response.");
  } catch (error) {
    return unavailable(source, errorReason(error));
  }
}
