import { z } from "zod";
import { redactText } from "@/lib/analysis/redact";
import { apiError, parseJson } from "@/lib/server/api";
import { limitRequest } from "@/lib/server/rate-limit";
import { getOptionalUser, createSupabaseServiceClient } from "@/lib/supabase/server";

const submissionSchema = z.object({
  scamType: z.string().min(2).max(100),
  text: z.string().min(5).max(12000),
  senderPattern: z.string().max(300).optional(),
  domain: z.string().max(2048).optional(),
});
export const runtime = "nodejs";
export async function POST(request: Request) {
  const service = createSupabaseServiceClient();
  if (!service)
    return apiError(
      "Community reporting is unavailable because no account service is configured.",
      503,
      "storage_unavailable",
    );
  const rate = await limitRequest(request);
  if (!rate.success)
    return apiError(
      "Too many submissions. Try again in one minute.",
      429,
      "rate_limited",
      60,
    );
  const parsed = submissionSchema.safeParse(await parseJson(request));
  if (!parsed.success)
    return apiError(
      "Check the scam type and redacted message.",
      400,
      "invalid_submission",
    );
  const user = await getOptionalUser();
  const { error } = await service.from("community_submissions").insert({
    reporter_id: user?.id ?? null,
    scam_type: parsed.data.scamType,
    redacted_text: redactText(parsed.data.text).text,
    sender_pattern: parsed.data.senderPattern,
    domain: parsed.data.domain,
    status: "pending",
  });
  if (error)
    return apiError(
      "The community report could not be submitted.",
      500,
      "submission_failed",
    );
  return Response.json({ status: "pending" }, { status: 202 });
}
