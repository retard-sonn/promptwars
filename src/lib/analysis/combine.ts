import { combinedScore, summaryFor, verdictFor } from "./analyze";
import type { RulesResult, Signal } from "./types";

export type CombineOptions = {
  flaggedByIntel?: boolean;
  aiSignals?: Signal[];
  aiSummary?: string;
};
export function combineAnalysis(
  rules: RulesResult,
  options: CombineOptions = {},
): RulesResult {
  if (options.flaggedByIntel) {
    return {
      ...rules,
      score: 100,
      confidence: 0.99,
      verdict: "Likely a scam",
      summary:
        "At least one configured threat source flagged this URL. Do not visit it or enter information.",
      signals: [...rules.signals, ...(options.aiSignals ?? [])],
    };
  }
  const signals = [...rules.signals, ...(options.aiSignals ?? [])];
  const score = combinedScore(signals);
  const verdict = verdictFor(score, "combined analysis", rules.links);
  return {
    ...rules,
    signals,
    score,
    verdict,
    confidence: Math.max(
      rules.confidence,
      Math.min(0.97, rules.confidence + (options.aiSignals?.length ? 0.04 : 0)),
    ),
    summary: options.aiSummary ?? summaryFor(verdict),
  };
}
