import { describe, expect, it } from "vitest";
import { redactedSpanToOriginal, redactText } from "../../src/lib/analysis/redact";

describe("redactText", () => {
  it("masks codes, identity numbers and phone numbers", () => {
    const original = "OTP 123456 card 4242 4242 4242 4242 Aadhaar 1234 5678 9012 SSN 123-45-6789 phone +1 202 555 0123";
    const result = redactText(original);
    expect(result.text).toContain("[CODE]");
    expect(result.text).toContain("[IDENTITY_NUMBER]");
    expect(result.text).toContain("[SSN]");
    expect(result.text).toContain("[PHONE]");
    expect(result.text).not.toContain("123456");
    expect(result.text).not.toContain("4242");
    expect(result.text).not.toContain("202 555");
  });
  it("maps unchanged evidence back to the original string", () => {
    const original = "Urgent OTP 123456. Pay Rs 49 now";
    const redacted = redactText(original);
    const start = redacted.text.indexOf("Pay Rs 49");
    const span = redactedSpanToOriginal({ start, end: start + 9 }, redacted);
    expect(original.slice(span.start, span.end)).toBe("Pay Rs 49");
  });
});
