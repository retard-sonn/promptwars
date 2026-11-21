import "server-only";
import { randomUUID } from "node:crypto";
import { recommendedActions } from "@/lib/analysis/actions";
import type { Channel, RegionId, RulesResult } from "@/lib/analysis/types";
import {
  reportSchema,
  type ProviderTrace,
  type Report,
  type UrlThreat,
} from "@/lib/contracts/report-types";

export function makeReport(
  rules: RulesResult,
  input: { message: string; channel: Channel; region: RegionId },
  options: {
    threats?: UrlThreat[];
    trace?: ProviderTrace[];
    redactedText?: string | null;
    actions?: string[];
    visualCues?: string[];
  } = {},
): Report {
  return reportSchema.parse({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    message: input.message,
    channel: input.channel === "unknown" ? rules.extraction.channel : input.channel,
    region: input.region,
    verdict: rules.verdict,
    score: rules.score,
    confidence: rules.confidence,
    summary: rules.summary,
    signals: rules.signals,
    links: rules.links,
    threats: options.threats ?? [],
    sender: rules.extraction.sender,
    recommendedActions:
      options.actions ?? recommendedActions(input.region, rules.verdict),
    providerTrace: options.trace ?? [
      {
        provider: "Rules engine",
        status: "completed",
        detail: "Local text, link and sender rules completed.",
      },
    ],
    redactedText: options.redactedText ?? null,
    visualCues: options.visualCues ?? [],
  });
}
