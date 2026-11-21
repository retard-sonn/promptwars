import { getRegionPack } from "./regions";
import type { RegionId, Verdict } from "./types";

export function recommendedActions(region: RegionId, verdict: Verdict): string[] {
  const pack = getRegionPack(region);
  const actions: string[] = [];
  if (verdict === "Likely a scam" || verdict === "Suspicious") {
    actions.push("Do not reply, pay, share a code or use the links while you verify the message.");
    actions.push("Contact the named organisation through its official app, website or the number on your card.");
    actions.push("Keep the message and any payment or sender details as evidence.");
  } else {
    actions.push("Check the sender and any links again if the message asks for money, codes or personal details.");
    actions.push("When in doubt, contact the organisation through a route you already know.");
  }
  if (verdict === "No clear signs of fraud") actions.push("This result can miss a new scam. It does not prove the message is genuine.");
  for (const channel of pack.reporting.slice(0, 2)) actions.push(`${channel.label}: ${channel.value}.`);
  return actions;
}
