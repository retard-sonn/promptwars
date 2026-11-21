import "server-only";
import { z } from "zod";
import type { ThreatResult } from "@/lib/contracts/report";
import { getServerEnv } from "@/lib/server/env";
import { errorReason, threatFetch, unavailable } from "./http";

const responseSchema = z.object({
  data: z.object({
    attributes: z.object({
      last_analysis_stats: z.object({
        malicious: z.number().nonnegative(),
        suspicious: z.number().nonnegative(),
        harmless: z.number().nonnegative().optional(),
      }),
    }),
  }),
});
export async function checkVirusTotal(url: string): Promise<ThreatResult> {
  const source = "VirusTotal" as const;
  const key = getServerEnv().VIRUSTOTAL_API_KEY;
  if (!key) return unavailable(source, "Not configured. No request was sent.");
  try {
    const id = Buffer.from(url).toString("base64url");
    const response = await threatFetch(`https://www.virustotal.com/api/v3/urls/${id}`, {
      headers: { "x-apikey": key },
    });
    if (response.status === 404)
      return unavailable(
        source,
        "VirusTotal has no existing report for this URL. No new scan was submitted.",
      );
    if (!response.ok)
      return unavailable(source, `The source returned HTTP ${response.status}.`);
    const stats = responseSchema.parse(await response.json()).data.attributes
      .last_analysis_stats;
    if (stats.malicious + stats.suspicious > 0)
      return {
        source,
        status: "flagged",
        reason: `VirusTotal shows ${stats.malicious + stats.suspicious} malicious or suspicious engine results.`,
      };
    return {
      source,
      status: "clean",
      reason:
        "VirusTotal shows no malicious or suspicious engine results in the existing report.",
    };
  } catch (error) {
    return unavailable(source, errorReason(error));
  }
}
