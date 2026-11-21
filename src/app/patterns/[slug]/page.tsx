import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { analyzeMessage } from "@/lib/analysis/analyze";
import { patternBySlug, patterns } from "@/lib/data/patterns";
import { makeReport } from "@/lib/server/report-factory";
import { PatternDetail } from "@/features/patterns/pattern-detail";

export function generateStaticParams() {
  return patterns.map((pattern) => ({ slug: pattern.slug }));
}
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => ({ title: patternBySlug(slug)?.name ?? "Pattern not found" }));
}
export const dynamicParams = false;
export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pattern = patternBySlug(slug);
  if (!pattern) notFound();
  const rules = analyzeMessage(pattern.example, pattern.region);
  const report = makeReport(rules, { message: pattern.example, channel: "unknown", region: pattern.region });
  return <PatternDetail pattern={pattern} report={report} />;
}
