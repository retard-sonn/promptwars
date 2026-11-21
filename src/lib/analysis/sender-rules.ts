import { getRegionPack } from "./regions";
import type { Extraction, RegionId, Signal } from "./types";

export function runSenderRules(input: string, extraction: Extraction, region: RegionId): Signal[] {
  const sender = extraction.sender;
  if (!sender) return [];
  const pack = getRegionPack(region);
  const index = input.indexOf(sender.raw);
  const span = { start: Math.max(0, index), end: Math.max(0, index) + sender.raw.length };
  const base = { quote: sender.raw, span, source: "sender" as const, tactic: "sender mismatch" as const };
  if (sender.address && sender.displayName) {
    const domain = sender.address.split("@")[1]?.toLowerCase() ?? "";
    for (const name of extraction.brands) {
      const brand = pack.brands.find((item) => item.name === name);
      if (!brand || !sender.displayName.toLowerCase().includes(name.toLowerCase())) continue;
      if (!brand.domains.some((official) => domain === official || domain.endsWith(`.${official}`))) {
        return [{ ...base, id: "sender.display-domain", weight: 35, confidence: 0.93, explanation: `The display name suggests ${name}, but the email address uses a different domain.` }];
      }
    }
  }
  if (sender.phone?.startsWith("+") && !pack.localCountryCodes.some((code) => sender.phone?.startsWith(code)) && extraction.brands.length) {
    return [{ ...base, id: "sender.foreign-number", weight: 26, confidence: 0.82, explanation: "The message names a local organisation but arrives from a foreign country code." }];
  }
  if (sender.phone && sender.phone.replace(/\D/g, "").length > 8 && extraction.brands.length) {
    return [{ ...base, id: "sender.long-number", weight: 19, confidence: 0.72, explanation: "A brand message from an ordinary long number deserves an independent sender check. Some legitimate services also use long numbers." }];
  }
  return [];
}
