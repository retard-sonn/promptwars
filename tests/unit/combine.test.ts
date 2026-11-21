import { describe, expect, it } from "vitest";
import { analyzeMessage } from "../../src/lib/analysis/analyze";
import { combineAnalysis } from "../../src/lib/analysis/combine";
import type { Signal } from "../../src/lib/analysis/types";

const aiSignal: Signal = {
  id: "ai.evidence.1", tactic: "urgency", weight: 12, confidence: 0.8,
  quote: "Hello", span: { start: 0, end: 5 }, explanation: "Example evidence", source: "text",
};
describe("combineAnalysis", () => {
  it("forces the highest verdict when a feed confirms a URL", () => {
    const result = combineAnalysis(analyzeMessage("https://bad.example", "generic"), { flaggedByIntel: true });
    expect(result.verdict).toBe("Likely a scam");
    expect(result.score).toBe(100);
  });
  it("never lowers the rule score on AI input", () => {
    const rules = analyzeMessage("Your account is blocked. Share your OTP.", "in");
    const result = combineAnalysis(rules, { aiSummary: "A short explanation." });
    expect(result.score).toBeGreaterThanOrEqual(rules.score);
    expect(result.summary).toBe("A short explanation.");
  });
  it("does not let an empty AI response change a clean rule verdict", () => {
    const result = combineAnalysis(analyzeMessage("Your delivery arrives today", "in"), { aiSignals: [aiSignal] });
    expect(result.verdict).toBe("No clear signs of fraud");
  });
});
