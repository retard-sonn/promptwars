import type { NormalisedText, Span } from "./types";

const zeroWidth = /[​‌‍⁠﻿]/g;
const homoglyphs: Record<string, string> = {
  а: "a", А: "A", е: "e", Е: "E", о: "o", О: "O", р: "p", Р: "P",
  с: "c", С: "C", х: "x", Х: "X", у: "y", У: "Y", і: "i", І: "I",
  ј: "j", Ј: "J", ѕ: "s", Ѕ: "S", α: "a", Α: "A", ο: "o", Ο: "O",
  ρ: "p", Ρ: "P", τ: "t", Τ: "T", υ: "u", Υ: "U", χ: "x", Χ: "X",
};

export function normaliseText(input: string): NormalisedText {
  let text = "";
  const starts: number[] = [];
  const ends: number[] = [];
  let originalIndex = 0;
  let zeroWidthRemoved = 0;
  for (const character of input) {
    const normalised = character.normalize("NFKC");
    for (let index = 0; index < normalised.length; index += 1) {
      const unit = normalised[index] ?? "";
      if (zeroWidth.test(unit)) {
        zeroWidthRemoved += 1;
        zeroWidth.lastIndex = 0;
        continue;
      }
      text += unit;
      starts.push(originalIndex);
      ends.push(originalIndex + character.length);
    }
    originalIndex += character.length;
  }
  return {
    text,
    starts,
    ends,
    mixedScript: /[a-z]/i.test(text) && /[Ѐ-ӿͰ-Ͽ]/.test(text),
    zeroWidthRemoved,
  };
}

export function toOriginalSpan(span: Span, normalised: NormalisedText, originalLength: number): Span {
  if (span.end <= span.start || normalised.starts.length === 0) return { start: 0, end: 0 };
  const start = normalised.starts[span.start] ?? originalLength;
  const end = normalised.ends[span.end - 1] ?? start;
  return { start, end: Math.max(start, end) };
}

export function foldHomoglyphs(value: string): string {
  return Array.from(value, (character) => homoglyphs[character] ?? character).join("");
}
