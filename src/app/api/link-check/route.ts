import { linkCheckRequestSchema } from "@/lib/contracts/report";
import { analyzeOnce } from "@/lib/server/analysis-service";
import { apiError, parseJson } from "@/lib/server/api";
import { limitRequest } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { getOptionalUser } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const user = await getOptionalUser();
  const rate = await limitRequest(request, user?.id);
  if (!rate.success)
    return apiError(
      "Too many link checks. Try again in one minute.",
      429,
      "rate_limited",
      60,
    );
  const parsed = linkCheckRequestSchema.safeParse(await parseJson(request));
  if (!parsed.success)
    return apiError("Enter a complete URL and a valid region.", 400, "invalid_request");
  const turnstile = user
    ? { success: true, skipped: true }
    : await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.success)
    return apiError(
      "The bot check could not be verified. Try again.",
      403,
      "turnstile_failed",
    );
  try {
    const report = await analyzeOnce({
      message: parsed.data.url,
      region: parsed.data.region,
      channel: "unknown",
    });
    return Response.json(
      { report },
      {
        headers: {
          "cache-control": "no-store",
          "x-ratelimit-remaining": String(rate.remaining),
        },
      },
    );
  } catch {
    return apiError(
      "The link check could not be completed. Try again.",
      500,
      "analysis_failed",
    );
  }
}
