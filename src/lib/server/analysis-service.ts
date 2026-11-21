import "server-only";
import { recommendedActions } from "@/lib/analysis/actions";
import { analyzeMessage } from "@/lib/analysis/analyze";
import { combineAnalysis } from "@/lib/analysis/combine";
import type { Channel, RegionId, RulesResult } from "@/lib/analysis/types";
import type { Report, StreamEvent } from "@/lib/contracts/report";
import { expandShortener } from "@/lib/intel/expand";
import { runThreatChecks } from "@/lib/intel/run";
import { getLlmProvider } from "@/lib/llm/provider";
import { readScreenshotWithProvider, runLlm } from "@/lib/llm/run";
import type { LlmImage } from "@/lib/llm/schemas";
import { getServerEnv } from "./env";
import { makeReport } from "./report-factory";

export type AnalysisInput = { message: string; region: RegionId; channel: Channel; image?: LlmImage };
async function expandLinks(rules: RulesResult) {
  if (getServerEnv().ENABLE_SHORTENER_EXPANSION !== "true") return;
  for (const [index, link] of rules.links.entries()) {
    if (!link.findings.some((finding) => finding.code === "shortener")) continue;
    try {
      const expanded = await expandShortener(link.normalized);
      rules.links[index] = { ...link, expandedUrl: expanded.finalUrl, findings: [...link.findings, {
        code: "expanded", label: "Resolved destination", detail: `HEAD requests resolved this link to ${expanded.finalUrl} after ${expanded.hops} redirect hops.`, weight: 0,
      }] };
    } catch {
      rules.links[index] = { ...link, findings: [...link.findings, {
        code: "expansion-error", label: "Destination not resolved", detail: "The link was not expanded because it failed the network safety checks or timed out.", weight: 0,
      }] };
    }
  }
}
export async function* analyzeWithStages(input: AnalysisInput): AsyncGenerator<StreamEvent> {
  let message = input.message;
  let visualCues: string[] = [];
  const baseTrace = [{ provider: "Rules engine", status: "completed" as const, detail: "Local text, link and sender rules completed." }];
  if (input.image) {
    const read = await readScreenshotWithProvider(input.image);
    message = [read.sender ? `Sender: ${read.sender}` : "", read.text, ...read.links].filter(Boolean).join("\n").slice(0, 12000);
    visualCues = read.visualCues;
    baseTrace.push({ provider: getLlmProvider()?.name ?? "Vision provider", status: "completed", detail: "Screenshot text and visual cues were extracted before the same rules pipeline." });
  }
  const rules = analyzeMessage(message, input.region);
  const baseInput = { message, channel: input.channel, region: input.region };
  yield { stage: "rules", report: makeReport(rules, baseInput, { trace: baseTrace, visualCues }) };

  await expandLinks(rules);
  const urls = [...new Set(rules.links.flatMap((link) => [link.normalized, link.expandedUrl].filter((url): url is string => Boolean(url))))];
  const threats = await runThreatChecks(urls);
  const flaggedByIntel = threats.some((entry) => entry.results.some((result) => result.status === "flagged"));
  const linked = combineAnalysis(rules, { flaggedByIntel });
  yield { stage: "links", report: makeReport(linked, baseInput, { threats, trace: baseTrace, visualCues }) };

  const llm = await runLlm(message);
  const completed = combineAnalysis(linked, { flaggedByIntel, aiSignals: llm.signals, aiSummary: llm.explanation?.plainSummary });
  const actions = [...new Set([...recommendedActions(input.region, completed.verdict), ...(llm.explanation?.recommendedActions ?? [])])].slice(0, 10);
  const report = makeReport(completed, baseInput, {
    threats,
    trace: [...baseTrace, llm.trace],
    redactedText: llm.redactedText,
    actions,
    visualCues,
  });
  yield { stage: "ai", report };
  yield { stage: "complete", report };
}
export async function analyzeOnce(input: AnalysisInput): Promise<Report> {
  let finalReport: Report | null = null;
  for await (const event of analyzeWithStages(input)) {
    if (event.stage === "complete") finalReport = event.report;
  }
  if (!finalReport) throw new Error("Analysis did not complete");
  return finalReport;
}
