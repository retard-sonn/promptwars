import { describe, expect, it } from "vitest";
import { parseProviderOutput, parseStructuredText } from "../../src/lib/llm/structured";

describe("parseStructuredText", () => {
  it("parses a JSON object", () => {
    expect(parseStructuredText('{"score": 80}')).toEqual({ score: 80 });
  });
  it("parses a fenced JSON object", () => {
    expect(parseStructuredText('```json\n{"score": 80}\n```')).toEqual({ score: 80 });
  });
  it("passes through tool input objects", () => {
    expect(parseProviderOutput({ score: 80 })).toEqual({ score: 80 });
  });
  it("rejects non-JSON commentary", () => {
    expect(() => parseStructuredText("This is not JSON")).toThrow();
  });
});
