import { describe, expect, it, vi } from "vitest";
import { runLlm } from "../../src/lib/llm/run";
import type { LlmProvider } from "../../src/lib/llm/schemas";

function providerWith(explain: LlmProvider["explain"]): LlmProvider {
  return {
    name: "Gemini",
    model: "test-model",
    explain,
    readScreenshot: vi.fn(),
  };
}
const explanation = {
  tactics: [
    {
      name: "payment demand",
      evidence: { quote: "Pay Rs 49", start: 0, end: 9 },
      explanation: "Payment is requested",
      confidence: 0.9,
    },
    {
      name: "urgency",
      evidence: { quote: "invented", start: 50, end: 58 },
      explanation: "Invalid evidence",
      confidence: 0.9,
    },
  ],
  impersonatedEntity: null,
  inferredIntent: "Collect a payment",
  plainSummary: "The message asks for a payment.",
  recommendedActions: ["Do not pay while you verify independently."],
};
describe("runLlm", () => {
  it("discards hallucinated evidence spans", async () => {
    const result = await runLlm(
      "Pay Rs 49 now",
      providerWith(async () => explanation),
    );
    expect(result.signals).toHaveLength(1);
    expect(result.signals[0]?.quote).toBe("Pay Rs 49");
    expect(result.trace.status).toBe("completed");
  });
  it("retries once after a provider failure", async () => {
    let calls = 0;
    const provider = providerWith(async () => {
      calls += 1;
      if (calls === 1) throw new Error("Temporary failure");
      return explanation;
    });
    const result = await runLlm("Pay Rs 49 now", provider);
    expect(calls).toBe(2);
    expect(result.trace.status).toBe("completed");
  });
  it("reports rules-only mode without a provider", async () => {
    const result = await runLlm("Hello", null);
    expect(result.trace.status).toBe("skipped");
    expect(result.redactedText).toBeNull();
  });
});
