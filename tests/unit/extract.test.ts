import { describe, expect, it } from "vitest";
import { extract } from "../../src/lib/analysis/extract";

describe("extract", () => {
  it("extracts communication entities and a sender", () => {
    const result = extract(
      "From: HDFC <alerts@hdfc.example>\nPay Rs 49 to +91 98765 43210 or user@upi. Use hdfc.example/pay.",
      "in",
    );
    expect(result.urls).toEqual(["hdfc.example/pay"]);
    expect(result.brands).toContain("HDFC");
    expect(result.sender?.address).toBe("alerts@hdfc.example");
    expect(result.entities.some((entity) => entity.kind === "phone")).toBe(true);
    expect(
      result.entities.some(
        (entity) => entity.kind === "upi" && entity.value === "user@upi",
      ),
    ).toBe(true);
    expect(
      result.entities.some(
        (entity) => entity.kind === "amount" && entity.value === "Rs 49",
      ),
    ).toBe(true);
    expect(result.channel).toBe("email");
  });
  it("does not treat the domain in an email as a separate URL", () => {
    const result = extract("Contact person@example.com for details", "generic");
    expect(result.urls).toEqual([]);
    expect(result.entities.find((entity) => entity.kind === "email")?.value).toBe(
      "person@example.com",
    );
  });
  it("removes sentence punctuation from a URL", () => {
    expect(extract("Visit https://parcel.example/pay.", "generic").urls[0]).toBe(
      "https://parcel.example/pay",
    );
  });
});
