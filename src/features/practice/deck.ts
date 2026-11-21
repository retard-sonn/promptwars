import { z } from "zod";
import { analyzeMessage } from "@/lib/analysis/analyze";
import { recommendedActions } from "@/lib/analysis/actions";
import { regionIds, type RegionId } from "@/lib/analysis/types";
import { reportSchema, type Report } from "@/lib/contracts/report";
import { patterns } from "@/lib/data/patterns";
import rawFixtures from "../../../fixtures/messages.json";

const fixtureSchema = z.object({ id: z.string(), label: z.enum(["scam", "legitimate"]), region: z.enum(regionIds), text: z.string() });
const fixtures = z.array(fixtureSchema).parse(rawFixtures);
export type PracticeCard = { id: string; text: string; label: "scam" | "legitimate"; region: RegionId };
const scams = patterns.slice(0, 8).map((pattern): PracticeCard => ({ id: pattern.slug, text: pattern.example, label: "scam", region: pattern.region }));
const legitimate = fixtures.filter((fixture) => fixture.label === "legitimate").slice(0, 4).map((fixture): PracticeCard => ({ id: fixture.id, text: fixture.text, label: "legitimate", region: fixture.region }));
export const practiceDeck: PracticeCard[] = [
  scams[0], legitimate[0], scams[1], scams[2], legitimate[1], scams[3],
  scams[4], legitimate[2], scams[5], scams[6], legitimate[3], scams[7],
].filter((card): card is PracticeCard => Boolean(card));
export function practiceReport(card: PracticeCard): Report {
  const rules = analyzeMessage(card.text, card.region);
  return reportSchema.parse({
    id: crypto.randomUUID(), createdAt: new Date().toISOString(), message: card.text,
    channel: "unknown", region: card.region, verdict: rules.verdict, score: rules.score,
    confidence: rules.confidence, summary: rules.summary, signals: rules.signals,
    links: rules.links, threats: [], sender: rules.extraction.sender,
    recommendedActions: recommendedActions(card.region, rules.verdict),
    providerTrace: [{ provider: "Practice rules", status: "completed", detail: "Local rules were used for this example." }],
    redactedText: null, visualCues: [],
  });
}
