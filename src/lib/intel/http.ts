import "server-only";
import type { ThreatResult } from "@/lib/contracts/report";

export function unavailable(
  source: ThreatResult["source"],
  reason: string,
): ThreatResult {
  return { source, status: "unavailable", reason };
}
export async function threatFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(4000), cache: "no-store" });
}
export function errorReason(error: unknown): string {
  return error instanceof Error && error.name === "TimeoutError"
    ? "The source timed out after 4 seconds."
    : "The source request failed.";
}
