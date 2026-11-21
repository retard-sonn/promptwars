export function parseStructuredText(text: string): unknown {
  const trimmed = text.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)\s*```$/.exec(trimmed);
  return JSON.parse(fenced?.[1] ?? trimmed);
}
export function parseProviderOutput(output: unknown): unknown {
  return typeof output === "string" ? parseStructuredText(output) : output;
}
