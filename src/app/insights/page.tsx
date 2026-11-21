import type { Metadata } from "next";
import { InsightsClient } from "@/features/insights/insights-client";

export const metadata: Metadata = { title: "Insights" };
export default function InsightsPage() {
  return <InsightsClient />;
}
