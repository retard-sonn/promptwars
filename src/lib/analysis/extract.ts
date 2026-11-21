import { getRegionPack } from "./regions";
import type { Entity, Extraction, RegionId, Sender } from "./types";

const urlPattern =
  /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|in|co|uk|gov|edu|info|online|site|top|xyz|click|link|work|live|example|test)(?::\d{2,5})?(?:\/[^\s<>"']*)?/gi;
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phonePattern = /\+?\d[\d\s().-]{7,}\d/g;
const upiPattern = /[\w.-]{2,}@[a-zA-Z][a-zA-Z0-9-]*/g;
const amountPattern = /(?:rs\.?|inr|usd|gbp|£|\$|₹)\s?[\d,]+(?:\.\d{1,2})?/gi;
const trailingPunctuation = /[.,!?;:)\]}]+$/;

function matches(input: string, pattern: RegExp) {
  return Array.from(input.matchAll(pattern), (match) => ({
    value: match[0],
    index: match.index ?? 0,
  }));
}
function escape(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function senderFrom(input: string): Sender | undefined {
  const match = /(?:^|\n)\s*(?:from|sender)\s*:\s*([^\n]+)/i.exec(input);
  const raw = match?.[1]?.trim();
  if (!raw) return undefined;
  const email = /<([^>]+@[^>]+)>/.exec(raw)?.[1];
  const phone = /\+?\d[\d\s().-]{7,}\d/.exec(raw)?.[0];
  return { raw, displayName: raw.replace(/<[^>]+>/g, "").trim(), address: email, phone };
}

export function extract(input: string, region: RegionId): Extraction {
  const entities: Entity[] = [];
  const urls: string[] = [];
  for (const match of matches(input, urlPattern)) {
    const previous = input[match.index - 1] ?? "";
    if (/[\w@.-]/.test(previous) && !match.value.startsWith("http")) continue;
    const value = match.value.replace(trailingPunctuation, "");
    const span = { start: match.index, end: match.index + value.length };
    entities.push({ kind: "url", value, span });
    urls.push(value);
  }
  for (const [kind, pattern] of [
    ["email", emailPattern],
    ["phone", phonePattern],
    ["amount", amountPattern],
  ] as const) {
    for (const match of matches(input, pattern)) {
      entities.push({
        kind,
        value: match.value,
        span: { start: match.index, end: match.index + match.value.length },
      });
    }
  }
  for (const match of matches(input, upiPattern)) {
    if (match.value.includes(".", match.value.indexOf("@"))) continue;
    entities.push({
      kind: "upi",
      value: match.value,
      span: { start: match.index, end: match.index + match.value.length },
    });
  }
  const brands: string[] = [];
  for (const brand of getRegionPack(region).brands) {
    const pattern = new RegExp(`\\b${escape(brand.name)}\\b`, "gi");
    const match = pattern.exec(input);
    if (!match || brands.includes(brand.name)) continue;
    brands.push(brand.name);
    entities.push({
      kind: "brand",
      value: match[0],
      span: { start: match.index, end: match.index + match[0].length },
    });
  }
  const sender = senderFrom(input);
  const channel = /whatsapp/i.test(input)
    ? "whatsapp"
    : sender?.address || /subject\s*:/i.test(input)
      ? "email"
      : "unknown";
  return { urls, entities, brands, sender, channel };
}
