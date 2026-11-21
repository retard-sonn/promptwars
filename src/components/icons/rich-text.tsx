import type { ReactNode } from "react";
import { iconNames } from "./definitions";
import { InlineIcon } from "./inline-icon";

export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const expression = /\{icon:([a-z-]+)\}/g;
  let cursor = 0;
  for (const match of text.matchAll(expression)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(text.slice(cursor, index));
    const name = iconNames.find((candidate) => candidate === match[1]);
    if (name) nodes.push(<InlineIcon name={name} key={`${name}-${index}`} />);
    else nodes.push(match[0]);
    cursor = index + match[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
