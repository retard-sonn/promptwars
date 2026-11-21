import { createHmac } from "node:crypto";
import { z } from "zod";
import { redactText } from "@/lib/analysis/redact";
import { getServerEnv } from "@/lib/server/env";
import { apiError, parseJson } from "@/lib/server/api";
import {
  getOptionalUser,
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";
import { saveReportRequestSchema } from "@/lib/supabase/reports";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const service = createSupabaseServiceClient();
  if (!service)
    return apiError(
      "Saving is unavailable because no account service is configured.",
      503,
      "storage_unavailable",
    );
  const user = await getOptionalUser();
  if (!user)
    return apiError("Sign in before saving a report.", 401, "authentication_required");
  const parsed = saveReportRequestSchema.safeParse(await parseJson(request));
  if (!parsed.success)
    return apiError("The report could not be validated.", 400, "invalid_report");
  const { report, storeRedacted } = parsed.data;
  const env = getServerEnv();
  const messageHash = createHmac("sha256", env.MESSAGE_HASH_PEPPER ?? "development-only")
    .update(report.message)
    .digest("hex");
  const { data, error } = await service
    .from("reports")
    .insert({
      user_id: user.id,
      channel: report.channel,
      region: report.region,
      verdict: report.verdict,
      score: report.score,
      confidence: report.confidence,
      summary: report.summary,
      signals: report.signals,
      urls: { links: report.links, threats: report.threats },
      message_redacted: storeRedacted ? redactText(report.message).text : null,
      message_hash: messageHash,
      provider_trace: report.providerTrace,
    })
    .select("id")
    .single();
  if (error) return apiError("The report could not be saved.", 500, "save_failed");
  const result = z.object({ id: z.string().uuid() }).parse(data);
  return Response.json(result, { status: 201, headers: { "cache-control": "no-store" } });
}
export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase)
    return apiError(
      "History is unavailable because no account service is configured.",
      503,
      "storage_unavailable",
    );
  const user = await getOptionalUser();
  if (!user)
    return apiError("Sign in to view your history.", 401, "authentication_required");
  const { data, error } = await supabase
    .from("reports")
    .select("id, verdict, score, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return apiError("History could not be loaded.", 500, "history_failed");
  const reports = z
    .array(
      z.object({
        id: z.string().uuid(),
        verdict: z.string(),
        score: z.number(),
        created_at: z.string().datetime(),
      }),
    )
    .parse(data);
  return Response.json({ reports }, { headers: { "cache-control": "no-store" } });
}
