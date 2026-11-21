import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { analyzeMessage } from "../../src/lib/analysis/analyze";
import { regionIds } from "../../src/lib/analysis/types";

const fixtureSchema = z.object({
  id: z.string(),
  label: z.enum(["scam", "legitimate"]),
  region: z.enum(regionIds),
  channel: z.string(),
  text: z.string().min(1),
});
const raw: unknown = JSON.parse(
  readFileSync(new URL("../../fixtures/messages.json", import.meta.url), "utf8"),
);
const fixtures = z.array(fixtureSchema).parse(raw);

describe("labelled message evaluation", () => {
  it("contains 40 scams and 40 hard negatives", () => {
    expect(fixtures).toHaveLength(80);
    expect(fixtures.filter((fixture) => fixture.label === "scam")).toHaveLength(40);
    expect(fixtures.filter((fixture) => fixture.label === "legitimate")).toHaveLength(40);
  });
  it("meets recall and false-positive thresholds on rules alone", () => {
    const results = fixtures.map((fixture) => ({
      fixture,
      result: analyzeMessage(fixture.text, fixture.region),
    }));
    const detected = (verdict: string) =>
      verdict === "Likely a scam" || verdict === "Suspicious";
    const scams = results.filter(({ fixture }) => fixture.label === "scam");
    const legitimate = results.filter(({ fixture }) => fixture.label === "legitimate");
    const missed = scams.filter(({ result }) => !detected(result.verdict));
    const falsePositives = legitimate.filter(({ result }) => detected(result.verdict));
    const recall = (scams.length - missed.length) / scams.length;
    const falsePositiveRate = falsePositives.length / legitimate.length;
    console.info(
      JSON.stringify({
        recall,
        falsePositiveRate,
        missed: missed.map(({ fixture, result }) => ({
          id: fixture.id,
          verdict: result.verdict,
          score: result.score,
        })),
        falsePositives: falsePositives.map(({ fixture, result }) => ({
          id: fixture.id,
          verdict: result.verdict,
          score: result.score,
        })),
      }),
    );
    expect(recall).toBeGreaterThanOrEqual(0.85);
    expect(falsePositiveRate).toBeLessThanOrEqual(0.05);
  });
  it("returns every evidence span exactly from the original message", () => {
    for (const fixture of fixtures) {
      const result = analyzeMessage(fixture.text, fixture.region);
      for (const signal of result.signals) {
        expect(
          fixture.text.slice(signal.span.start, signal.span.end),
          `${fixture.id}: ${signal.id}`,
        ).toBe(signal.quote);
      }
    }
  });
});
