"use client";

import { PageHero } from "@/components/layout/page-hero";
import { patterns } from "@/lib/data/patterns";
import { TacticChart } from "./tactic-chart";
import { UserChecksChart, type CheckPoint } from "./user-checks-chart";

export function InsightsClient({ points = [] }: { points?: CheckPoint[] }) {
  return <main>
    <PageHero title="Insights from real data"><p>The tactic network comes from the {patterns.length} patterns in the library. Your own chart appears only after you save reports.</p></PageHero>
    <div className="container insights-layout">
      <section className="glass-strong panel-40"><h2>Tactics that appear together</h2><p>Line thickness shows co-occurrence in the library. Circle size shows the number of patterns using that tactic.</p><TacticChart /></section>
      <section><h2>Your checks over time</h2><UserChecksChart points={points} /></section>
    </div>
  </main>;
}
