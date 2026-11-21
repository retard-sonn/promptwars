import { z } from "zod";
import { regionIds } from "@/lib/analysis/types";

const spanSchema = z.object({
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
});
const signalSchema = z.object({
  id: z.string(),
  tactic: z.string(),
  weight: z.number(),
  confidence: z.number(),
  quote: z.string(),
  span: spanSchema,
  explanation: z.string(),
  source: z.enum(["text", "link", "sender"]),
});
const linkSchema = z.object({
  raw: z.string(),
  normalized: z.string(),
  host: z.string(),
  span: spanSchema,
  anatomy: z.object({
    scheme: z.string(),
    subdomain: z.string(),
    domain: z.string(),
    tld: z.string(),
    path: z.string(),
  }),
  findings: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
      detail: z.string(),
      weight: z.number(),
    }),
  ),
  lookalikeOf: z.string().optional(),
  expandedUrl: z.string().optional(),
});
export const threatResultSchema = z.object({
  source: z.enum(["Google Web Risk", "URLhaus", "PhishTank", "OpenPhish", "VirusTotal"]),
  status: z.enum(["clean", "flagged", "unavailable"]),
  reason: z.string(),
  cacheUntil: z.string().datetime().optional(),
});
export const urlThreatSchema = z.object({
  url: z.string(),
  results: z.array(threatResultSchema),
});
export const providerTraceSchema = z.object({
  provider: z.string(),
  status: z.enum(["completed", "skipped", "error"]),
  detail: z.string(),
});
export const analyzeRequestSchema = z.object({
  message: z.string().min(1).max(12000),
  region: z.enum(regionIds).default("generic"),
  channel: z.enum(["sms", "whatsapp", "email", "unknown"]).default("unknown"),
  turnstileToken: z.string().max(4096).optional(),
});
export const linkCheckRequestSchema = z.object({
  url: z.string().min(1).max(2048),
  region: z.enum(regionIds).default("generic"),
  turnstileToken: z.string().max(4096).optional(),
});
export const reportSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  message: z.string(),
  channel: z.enum(["sms", "whatsapp", "email", "unknown"]),
  region: z.enum(regionIds),
  verdict: z.enum([
    "Likely a scam",
    "Suspicious",
    "No clear signs of fraud",
    "Not enough to tell",
  ]),
  score: z.number().int().min(0).max(100),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  signals: z.array(signalSchema),
  links: z.array(linkSchema),
  threats: z.array(urlThreatSchema),
  sender: z
    .object({
      raw: z.string(),
      displayName: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  recommendedActions: z.array(z.string()),
  providerTrace: z.array(providerTraceSchema),
  redactedText: z.string().nullable(),
  visualCues: z.array(z.string()).default([]),
});
export type Report = z.infer<typeof reportSchema>;
export type ThreatResult = z.infer<typeof threatResultSchema>;
export type ProviderTrace = z.infer<typeof providerTraceSchema>;
export const streamEventSchema = z.discriminatedUnion("stage", [
  z.object({ stage: z.literal("rules"), report: reportSchema }),
  z.object({ stage: z.literal("links"), report: reportSchema }),
  z.object({ stage: z.literal("ai"), report: reportSchema }),
  z.object({ stage: z.literal("complete"), report: reportSchema }),
  z.object({ stage: z.literal("error"), error: z.string() }),
]);
export type StreamEvent = z.infer<typeof streamEventSchema>;
