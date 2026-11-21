import type { Span } from "./types";

export type RedactedText = { text: string; starts: number[]; ends: number[] };
const sensitiveNumber = /\+?\d[\d\s().-]{7,}\d|\b\d{4,8}\b/g;

function placeholder(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (/^\d{3}-\d{2}-\d{4}$/.test(raw)) return "[SSN]";
  if (digits.length >= 12 && digits.length <= 19) return "[IDENTITY_NUMBER]";
  if (raw.startsWith("+") || digits.length === 10 || digits.length === 11) return "[PHONE]";
  if (digits.length >= 4 && digits.length <= 8) return "[CODE]";
  return "[NUMBER]";
}
function appendMapped(target: RedactedText, value: string, start: number, end: number) {
  target.text += value;
  for (let index = 0; index < value.length; index += 1) {
    target.starts.push(start);
    target.ends.push(end);
  }
}
export function redactText(input: string): RedactedText {
  const result: RedactedText = { text: "", starts: [], ends: [] };
  let cursor = 0;
  for (const match of input.matchAll(sensitiveNumber)) {
    const index = match.index ?? 0;
    for (let offset = 0; offset < index - cursor; offset += 1) {
      appendMapped(result, input[cursor + offset] ?? "", cursor + offset, cursor + offset + 1);
    }
    appendMapped(result, placeholder(match[0]), index, index + match[0].length);
    cursor = index + match[0].length;
  }
  for (let offset = cursor; offset < input.length; offset += 1) {
    appendMapped(result, input[offset] ?? "", offset, offset + 1);
  }
  return result;
}
export function redactedSpanToOriginal(span: Span, redacted: RedactedText): Span {
  return {
    start: redacted.starts[span.start] ?? 0,
    end: redacted.ends[span.end - 1] ?? redacted.starts[span.start] ?? 0,
  };
}
