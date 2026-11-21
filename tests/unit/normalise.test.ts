import { describe, expect, it } from "vitest";
import { foldHomoglyphs, normaliseText, toOriginalSpan } from "../../src/lib/analysis/normalise";

describe("normaliseText", () => {
  it("normalises compatibility characters", () => {
    expect(normaliseText("ｐａｙ ＲＳ ４９").text).toBe("pay RS 49");
  });
  it("removes zero-width characters and preserves source offsets", () => {
    const original = "Pay pa​ypal now";
    const normalised = normaliseText(original);
    const span = toOriginalSpan({ start: 4, end: 10 }, normalised, original.length);
    expect(normalised.text).toBe("Pay paypal now");
    expect(original.slice(span.start, span.end)).toBe("pa​ypal");
  });
  it("detects mixed writing systems", () => {
    const result = normaliseText("pаypal");
    expect(result.mixedScript).toBe(true);
    expect(foldHomoglyphs(result.text)).toBe("paypal");
  });
  it("handles supplementary Unicode characters", () => {
    const original = "𝒜 urgent";
    const normalised = normaliseText(original);
    expect(normalised.text).toBe("A urgent");
    expect(toOriginalSpan({ start: 0, end: 1 }, normalised, original.length)).toEqual({ start: 0, end: 2 });
  });
});
