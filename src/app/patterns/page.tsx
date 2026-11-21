import type { Metadata } from "next";
import { PatternsClient } from "@/features/patterns/patterns-client";

export const metadata: Metadata = { title: "Common scam patterns", description: "Real example messages, warning signs and advice for common digital scams." };
export default function PatternsPage() {
  return <PatternsClient />;
}
