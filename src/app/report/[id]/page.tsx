import type { Metadata } from "next";
import { SavedReport } from "@/features/report/saved-report";

export const metadata: Metadata = { title: "Saved report" };
export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SavedReport id={id} />;
}
