import { extract } from "./extract";
import { analyseLink, linksToSignals } from "./link-rules";
import { normaliseText, toOriginalSpan } from "./normalise";
import { runSenderRules } from "./sender-rules";
import { runTextRules } from "./text-rules";
import type { AnalyzedLink, RegionId, RulesResult, Signal, Verdict } from "./types";

export function verdictFor(score: number, input: string, links: AnalyzedLink[]): Verdict {
  if (input.trim().length < 12 && links.length === 0) return "Not enough to tell";
  if (score >= 55) return "Likely a scam";
  if (score >= 25) return "Suspicious";
  return "No clear signs of fraud";
}
export function combinedScore(signals: Signal[]) {
  const tactics = new Map<string, number[]>();
  for (const signal of signals) {
    const weights = tactics.get(signal.tactic) ?? [];
    weights.push(signal.weight);
    tactics.set(signal.tactic, weights);
  }
  let score = 0;
  for (const weights of tactics.values()) {
    weights.sort((a, b) => b - a);
    score +=
      (weights[0] ?? 0) +
      weights.slice(1, 3).reduce((sum, weight) => sum + Math.min(5, weight * 0.15), 0);
  }
  return Math.min(100, Math.round(score));
}
export function summaryFor(verdict: Verdict) {
  if (verdict === "Likely a scam")
    return "Several warning signs suggest fraud. Do not reply, pay or use its links while you verify independently.";
  if (verdict === "Suspicious")
    return "Some details need an independent check before you reply, pay or share information.";
  if (verdict === "No clear signs of fraud")
    return "No rule-based warning signs were found. This does not prove the message is genuine.";
  return "There is not enough content for a useful check. Add the full message or a link.";
}

export function analyzeMessage(
  message: string,
  region: RegionId = "generic",
): RulesResult {
  const normalised = normaliseText(message);
  const extraction = extract(normalised.text, region);
  const links = extraction.entities
    .filter((entity) => entity.kind === "url")
    .slice(0, 5)
    .map((entity) => analyseLink(entity.value, entity.span, region));
  const textSignals = runTextRules(normalised.text);
  const signals = [
    ...textSignals,
    ...linksToSignals(links),
    ...runSenderRules(normalised.text, extraction, region),
  ].map((signal) => {
    const span = toOriginalSpan(signal.span, normalised, message.length);
    return { ...signal, span, quote: message.slice(span.start, span.end) };
  });
  const score = combinedScore(signals);
  const verdict = verdictFor(score, message, links);
  const confidence =
    verdict === "Not enough to tell"
      ? 0.2
      : Math.min(0.96, 0.38 + score / 180 + Math.min(0.12, signals.length * 0.025));
  return {
    score,
    confidence: Number(confidence.toFixed(2)),
    verdict,
    signals,
    links,
    extraction,
    normalisation: {
      mixedScript: normalised.mixedScript,
      zeroWidthRemoved: normalised.zeroWidthRemoved,
    },
    summary: summaryFor(verdict),
  };
}
