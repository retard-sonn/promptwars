"use client";

import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { getRegionPack } from "@/lib/analysis/regions";
import type { Report } from "@/lib/contracts/report";
import type { ScamPattern } from "@/lib/data/patterns";
import { AnnotatedMessage } from "@/features/report/annotated-message";

export function PatternDetail({
  pattern,
  report,
}: {
  pattern: ScamPattern;
  report: Report;
}) {
  const pack = getRegionPack(pattern.region);
  return (
    <main>
      <PageHero title={pattern.name}>
        <p>{pattern.explanation}</p>
        <p>
          <Link href="/patterns">Back to all patterns</Link>
        </p>
      </PageHero>
      <div className="container pattern-detail-grid">
        <section className="glass-strong panel-40">
          <h2>Example anatomy</h2>
          <p>
            The highlighted evidence comes from the same rules engine used by the checker.
          </p>
          <AnnotatedMessage report={report} />
        </section>
        <aside className="pattern-advice glass-tint panel-28">
          <h2>What to do</h2>
          <p>{pattern.advice}</p>
          <h3>Reporting in {pack.name}</h3>
          <ul>
            {pack.reporting.map((channel) => (
              <li key={channel.label}>
                <strong>{channel.label}</strong>
                <span>{channel.value}</span>
                {channel.url ? (
                  <a href={channel.url} target="_blank" rel="noreferrer">
                    Open official site
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="small muted">Region pack verified {pack.lastVerified}.</p>
        </aside>
      </div>
    </main>
  );
}
