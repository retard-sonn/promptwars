import { analyzeRequestSchema } from "@/lib/contracts/report";
import { streamEventSchema } from "@/lib/contracts/report";
import { getLlmProvider } from "@/lib/llm/provider";
import { analyzeWithStages } from "@/lib/server/analysis-service";
import { apiError, parseJson } from "@/lib/server/api";
import { validateImage } from "@/lib/server/image";
import { limitRequest } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import type { LlmImage } from "@/lib/llm/schemas";
import { getOptionalUser } from "@/lib/supabase/server";
import { after } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(request: Request) {
  const user = await getOptionalUser();
  const rate = await limitRequest(request, user?.id);
  if (!rate.success)
    return apiError("Too many checks. Try again in one minute.", 429, "rate_limited", 60);
  let body: unknown;
  let image: LlmImage | undefined;
  if (request.headers.get("content-type")?.includes("multipart/form-data")) {
    const form = await request.formData();
    body = {
      message: String(form.get("message") || "Screenshot upload"),
      region: String(form.get("region") || "generic"),
      channel: String(form.get("channel") || "unknown"),
      turnstileToken: form.get("turnstileToken")
        ? String(form.get("turnstileToken"))
        : undefined,
    };
    const file = form.get("image");
    if (file instanceof File) {
      try {
        image = await validateImage(file);
      } catch (error) {
        return apiError(
          error instanceof Error ? error.message : "Invalid image",
          400,
          "invalid_image",
        );
      }
    }
  } else {
    body = await parseJson(request);
  }
  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success)
    return apiError(
      "Enter a message of up to 12,000 characters and a valid region.",
      400,
      "invalid_request",
    );
  const turnstile = user
    ? { success: true, skipped: true }
    : await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.success)
    return apiError(
      "The bot check could not be verified. Try again.",
      403,
      "turnstile_failed",
    );
  if (image && !getLlmProvider())
    return apiError(
      "Screenshot text extraction needs a configured vision provider. Paste the message text instead.",
      503,
      "vision_unavailable",
    );

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of analyzeWithStages({ ...parsed.data, image })) {
          const valid = streamEventSchema.parse(event);
          if (valid.stage === "complete")
            after(() =>
              trackServerEvent("analysis_completed", {
                region: valid.report.region,
                channel: valid.report.channel,
                verdict: valid.report.verdict,
                scoreBand: `${Math.floor(valid.report.score / 25) * 25} to ${Math.floor(valid.report.score / 25) * 25 + 24}`,
                provider: valid.report.providerTrace.at(-1)?.provider ?? "Rules engine",
              }),
            );
          controller.enqueue(encoder.encode(`${JSON.stringify(valid)}\n`));
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            `${JSON.stringify({ stage: "error", error: image ? "The screenshot could not be read. Paste the message text instead." : "The check could not be completed. Try again." })}\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-content-type-options": "nosniff",
      "x-ratelimit-limit": String(rate.limit),
      "x-ratelimit-remaining": String(rate.remaining),
    },
  });
}
