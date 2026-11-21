import { z } from "zod";
import { recommendedActions } from "@/lib/analysis/actions";
import { reportSchema, type Report } from "@/lib/contracts/report";

export const saveReportRequestSchema = z.object({
  report: reportSchema,
  storeRedacted: z.boolean().default(false),
});
export const storedReportRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  channel: reportSchema.shape.channel,
  region: reportSchema.shape.region,
  verdict: reportSchema.shape.verdict,
  score: reportSchema.shape.score,
  confidence: reportSchema.shape.confidence,
  summary: z.string(),
  signals: reportSchema.shape.signals,
  urls: z.object({
    links: reportSchema.shape.links,
    threats: reportSchema.shape.threats,
  }),
  message_redacted: z.string().nullable(),
  provider_trace: reportSchema.shape.providerTrace,
  created_at: z.string().datetime(),
});
export type StoredReportRow = z.infer<typeof storedReportRowSchema>;
export function mapStoredReport(row: StoredReportRow): Report {
  return reportSchema.parse({
    id: row.id,
    createdAt: row.created_at,
    message: row.message_redacted ?? "The original message was not saved.",
    channel: row.channel,
    region: row.region,
    verdict: row.verdict,
    score: row.score,
    confidence: row.confidence,
    summary: row.summary,
    signals: row.signals,
    links: row.urls.links,
    threats: row.urls.threats,
    recommendedActions: recommendedActions(row.region, row.verdict),
    providerTrace: row.provider_trace,
    redactedText: row.message_redacted,
    visualCues: [],
  });
}
