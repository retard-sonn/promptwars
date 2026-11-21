import "server-only";
import { redactedSpanToOriginal, redactText } from "@/lib/analysis/redact";
import { validEvidenceSpan } from "@/lib/analysis/prompt";
import type { Signal, Tactic } from "@/lib/analysis/types";
import type { ProviderTrace } from "@/lib/contracts/report";
import { getLlmProvider } from "./provider";
import type { LlmExplanation, LlmImage, LlmProvider } from "./schemas";

const tacticNames: Tactic[] = [
  "urgency", "impersonation", "payment demand", "credential or OTP request",
  "authority pressure", "too-good-to-be-true", "secrecy", "threat of loss",
  "lookalike link", "sender mismatch",
];
export type LlmRunResult = {
  signals: Signal[];
  explanation: LlmExplanation | null;
  trace: ProviderTrace;
  redactedText: string | null;
};
async function withTimeout<T>(operation: (signal: AbortSignal) => Promise<T>, milliseconds = 12000): Promise<T> {
  const controller = new AbortController();
  let rejectTimer: ((reason: Error) => void) | undefined;
  const timer = new Promise<never>((_, reject) => { rejectTimer = reject; });
  const timeout = setTimeout(() => {
    controller.abort();
    rejectTimer?.(new Error("Provider timed out"));
  }, milliseconds);
  try {
    return await Promise.race([operation(controller.signal), timer]);
  } finally {
    clearTimeout(timeout);
  }
}
function evidenceSignals(original: string, redacted: ReturnType<typeof redactText>, explanation: LlmExplanation): Signal[] {
  const signals: Signal[] = [];
  for (const [index, tactic] of explanation.tactics.entries()) {
    const name = tacticNames.find((candidate) => candidate === tactic.name);
    if (!name || !validEvidenceSpan(redacted.text, tactic.evidence.quote, tactic.evidence.start, tactic.evidence.end)) continue;
    const span = redactedSpanToOriginal(tactic.evidence, redacted);
    const quote = original.slice(span.start, span.end);
    if (quote !== tactic.evidence.quote) continue;
    signals.push({
      id: `ai.evidence.${index + 1}`,
      tactic: name,
      weight: 12,
      confidence: tactic.confidence,
      quote,
      span,
      explanation: tactic.explanation,
      source: "text",
    });
  }
  return signals;
}
export async function readScreenshotWithProvider(image: LlmImage, provider: LlmProvider | null = getLlmProvider()) {
  if (!provider) throw new Error("No vision provider is configured");
  let lastError = new Error("Screenshot extraction failed");
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await withTimeout((signal) => provider.readScreenshot(image, signal), 30000);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Screenshot extraction failed");
    }
  }
  throw lastError;
}

export async function runLlm(original: string, provider: LlmProvider | null = getLlmProvider()): Promise<LlmRunResult> {
  const redacted = redactText(original);
  if (!provider) return {
    signals: [], explanation: null, redactedText: null,
    trace: { provider: "AI explanation", status: "skipped", detail: "No AI provider is configured. This result uses rules only." },
  };
  let lastError = "Unknown provider error";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const explanation = await withTimeout((signal) => provider.explain(redacted.text, signal));
      return {
        signals: evidenceSignals(original, redacted, explanation),
        explanation,
        redactedText: redacted.text,
        trace: { provider: provider.name, status: "completed", detail: `${provider.name} returned a validated structured explanation using ${provider.model}.` },
      };
    } catch (error) {
      lastError = error instanceof Error ? error.name : "ProviderError";
    }
  }
  return {
    signals: [], explanation: null, redactedText: redacted.text,
    trace: { provider: provider.name, status: "error", detail: `${provider.name} failed after one retry (${lastError}). Rules-only results are shown.` },
  };
}
