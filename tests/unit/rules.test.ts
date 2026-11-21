import { describe, expect, it } from "vitest";
import { analyseLink, editDistance } from "../../src/lib/analysis/link-rules";
import { runSenderRules } from "../../src/lib/analysis/sender-rules";
import { runTextRules } from "../../src/lib/analysis/text-rules";
import { extract } from "../../src/lib/analysis/extract";
import { urlAnatomy } from "../../src/lib/analysis/url-anatomy";

const span = { start: 0, end: 20 };
describe("text rules", () => {
  it.each([
    ["Act now", "urgency.deadline"],
    ["Your account is blocked", "threat.account"],
    ["Pay Rs 49", "payment.request"],
    ["Share your OTP", "credential.request"],
    ["Verify your account", "credential.harvest"],
    ["Customs called", "authority.named"],
    ["You have won a lottery", "offer.prize"],
    ["Keep this confidential", "secrecy.demand"],
    ["Your parcel is held", "delivery.hold"],
    ["FASTag blocked", "payment.toll"],
    ["Complete tasks for commission", "offer.tasks"],
    ["Your tax refund is ready, click here", "offer.refund"],
    ["The loan caller will defame me to my contact list", "threat.loan"],
    ["Customer care number: call now", "impersonation.support"],
    ["KYC verification", "impersonation.kyc"],
    ["Hi Mum, this is my new number", "impersonation.relative"],
  ])("detects %s", (text, id) => {
    expect(runTextRules(text).some((signal) => signal.id.startsWith(id))).toBe(true);
  });
  it("does not flag protective credential advice", () => {
    expect(runTextRules("Never share your OTP. Do not share your password.")).toEqual([]);
  });
  it("returns exact match spans", () => {
    const text = "Hello. Pay Rs 49 today.";
    const signal = runTextRules(text)[0];
    expect(signal && text.slice(signal.span.start, signal.span.end)).toBe("Pay Rs 49");
  });
});

describe("link rules", () => {
  it("detects a lookalike character", () => {
    const result = analyseLink("https://paypa1.example/login", span, "us");
    expect(result.lookalikeOf).toBe("paypal.com");
    expect(result.findings.some((finding) => finding.code === "lookalike-domain")).toBe(true);
  });
  it("detects a brand on an unrelated domain", () => {
    expect(analyseLink("https://indiapost-redelivery.example/pay", span, "in").findings[0]?.code).toBe("brand-mismatch");
  });
  it("allows an official domain and its subdomains", () => {
    expect(analyseLink("https://secure.paypal.com/signin", span, "us").findings).toEqual([]);
  });
  it("detects IP hosts, @ tricks, punycode and shorteners", () => {
    expect(analyseLink("http://192.0.2.1", span, "generic").findings.some((finding) => finding.code === "ip-host")).toBe(true);
    expect(analyseLink("https://paypal.com@phish.example", span, "generic").findings.some((finding) => finding.code === "at-trick")).toBe(true);
    expect(analyseLink("https://xn--pypal-4ve.example", span, "generic").findings.some((finding) => finding.code === "punycode")).toBe(true);
    expect(analyseLink("https://short.example/a", span, "generic").findings.some((finding) => finding.code === "shortener")).toBe(true);
  });
  it("calculates edit distance and URL anatomy", () => {
    expect(editDistance("paypa1", "paypal")).toBe(1);
    expect(urlAnatomy(new URL("https://pay.bills.example.co.uk/path?q=1"))).toEqual({ scheme: "https", subdomain: "pay.bills", domain: "example", tld: "co.uk", path: "/path?q=1" });
  });
});

describe("sender rules", () => {
  it("detects display-name spoofing", () => {
    const text = "From: PayPal <service@random.example>\nVerify your account";
    expect(runSenderRules(text, extract(text, "us"), "us")[0]?.id).toBe("sender.display-domain");
  });
  it("detects a foreign number naming a local brand", () => {
    const text = "From: +44 7700 900123\nSBI account notice";
    expect(runSenderRules(text, extract(text, "in"), "in")[0]?.id).toBe("sender.foreign-number");
  });
});
