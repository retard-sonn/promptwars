"use client";

import Link from "next/link";
import { RichText } from "@/components/icons/rich-text";
import { Icon } from "@/components/icons/icon";
import { patterns } from "@/lib/data/patterns";
import { Composer } from "@/features/analysis/composer";
import { useAnalysis } from "@/features/analysis/use-analysis";
import { ReportView } from "@/features/report/report-view";
import { HeroScene } from "./hero-scene";
import { OpeningHook } from "./opening-hook";
import { StoryChapters } from "./story-chapters";

export function HomeClient() {
  const { analyze, report, stage, error } = useAnalysis();
  return (
    <main>
      <OpeningHook />
      <section className="home-hero container">
        <div className="hero-copy">
          <h1>
            <RichText text="Check a suspicious {icon:message} message before you {icon:hook} reply." />
          </h1>
          <p className="hero-sub">
            Paste an SMS, WhatsApp message, email or link. You get the warning signs, what
            they mean, and what to do next.
          </p>
          <Composer analyze={analyze} stage={stage} error={error} />
        </div>
        <HeroScene />
      </section>
      <div className="container" id="report">
        {report ? (
          <ReportView report={report} stage={stage} />
        ) : stage === "waiting" ? (
          <div className="report-loading glass-strong panel-40" role="status">
            <div className="skeleton" />
            <p>Running the local rules engine.</p>
          </div>
        ) : null}
      </div>
      <StoryChapters />
      <section
        className="section container home-patterns"
        aria-labelledby="pattern-preview"
      >
        <div className="section-heading">
          <h2 id="pattern-preview">Common scam patterns</h2>
          <Link href="/patterns">
            View all {patterns.length} patterns
            <Icon name="arrow-up-right" size={20} />
          </Link>
        </div>
        <div className="pattern-preview-list">
          {patterns.slice(0, 3).map((pattern) => (
            <Link href={`/patterns/${pattern.slug}`} key={pattern.slug}>
              <strong>{pattern.name}</strong>
              <p>{pattern.explanation}</p>
              <span>{pattern.district}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="practice-teaser container glass-strong panel-40">
        <div>
          <h2>Practice spotting scams</h2>
          <p>
            Use twelve example messages from the pattern library and legitimate alerts.
            Review the evidence after each answer.
          </p>
        </div>
        <Link href="/practice" className="button">
          Start a practice round
          <Icon name="arrow-up-right" size={20} />
        </Link>
      </section>
      <section className="emergency-band" aria-labelledby="emergency-home">
        <div className="container">
          <Icon name="warning" size={48} />
          <div>
            <h2 id="emergency-home">If you already clicked, paid or shared a code</h2>
            <p>
              Choose what happened to get steps for the first hour, the first day and the
              first week, including official reporting channels for your region.
            </p>
          </div>
          <Link href="/help" className="button button--black">
            Open the emergency checklist
            <Icon name="arrow-up-right" size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}
