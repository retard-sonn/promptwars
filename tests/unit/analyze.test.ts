import { describe, expect, it } from "vitest";
import { analyzeMessage } from "../../src/lib/analysis/analyze";

describe("analyzeMessage", () => {
  it("combines independent warning signs", () => {
    const result = analyzeMessage(
      "Urgent: your account is blocked. Share your OTP now.",
      "in",
    );
    expect(result.verdict).toBe("Likely a scam");
    expect(result.score).toBeGreaterThanOrEqual(55);
    expect(result.confidence).toBeGreaterThan(0.5);
  });
  it("uses cautious language when no rules match", () => {
    const result = analyzeMessage("Your parcel is out for delivery today.", "in");
    expect(result.verdict).toBe("No clear signs of fraud");
    expect(result.summary).toContain("does not prove");
  });
  it("requests more content for a fragment", () => {
    expect(analyzeMessage("Hello").verdict).toBe("Not enough to tell");
  });
  it("handles an incomplete URL without throwing", () => {
    expect(() => analyzeMessage("http://?", "generic")).not.toThrow();
  });
  it("keeps original quotes after normalisation", () => {
    const original = "Ｐａｙ Ｒｓ ４９ now";
    const result = analyzeMessage(original, "in");
    expect(result.signals.length).toBeGreaterThan(0);
    for (const signal of result.signals)
      expect(original.slice(signal.span.start, signal.span.end)).toBe(signal.quote);
  });
});
