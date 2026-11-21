import { z } from "zod";
import { apiError } from "@/lib/server/api";
import { assertReportOwner } from "@/lib/server/access";
import { getOptionalUser, createSupabaseServerClient } from "@/lib/supabase/server";
import { mapStoredReport, storedReportRowSchema } from "@/lib/supabase/reports";

export const runtime = "nodejs";
async function loadOwnedReport(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("storage_unavailable");
  const user = await getOptionalUser();
  if (!user) throw new Error("authentication_required");
  const { data, error } = await supabase.from("reports").select("id, user_id, channel, region, verdict, score, confidence, summary, signals, urls, message_redacted, provider_trace, created_at").eq("id", id).single();
  if (error) throw new Error("not_found");
  const row = storedReportRowSchema.parse(data);
  assertReportOwner(user.id, row.user_id);
  return { supabase, row };
}
function errorResponse(error: unknown) {
  const code = error instanceof Error ? error.message : "unknown";
  if (code === "storage_unavailable") return apiError("The account service is not configured.", 503, code);
  if (code === "authentication_required") return apiError("Sign in to access this report.", 401, code);
  if (code === "not_found") return apiError("Report not found.", 404, code);
  if (code === "forbidden") return apiError("You do not have access to this report.", 403, code);
  return apiError("The report could not be loaded.", 500, "report_failed");
}
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    z.string().uuid().parse(id);
    const { row } = await loadOwnedReport(id);
    return Response.json(mapStoredReport(row), { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    z.string().uuid().parse(id);
    const { supabase, row } = await loadOwnedReport(id);
    const { error } = await supabase.from("reports").delete().eq("id", row.id);
    if (error) return apiError("The report could not be deleted.", 500, "delete_failed");
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
