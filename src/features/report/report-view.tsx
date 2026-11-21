"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/icons/icon";
import type { Report } from "@/lib/contracts/report";
import { getRegionPack } from "@/lib/analysis/regions";
import type { AnalysisStage } from "@/features/analysis/use-analysis";
import { AnnotatedMessage } from "./annotated-message";
import { CopyButton } from "./copy-button";
import { Gauge } from "./gauge";
import { LinkReport } from "./link-report";
import { SaveReportButton } from "./save-report-button";

function verdictIcon(verdict: Report["verdict"]) {
  if (verdict === "Likely a scam") return "shield-alert" as const;
  if (verdict === "Suspicious") return "warning" as const;
  if (verdict === "No clear signs of fraud") return "shield-check" as const;
  return "info" as const;
}
export function ReportView({ report, stage }: { report: Report; stage: AnalysisStage }) {
  const verdictClass = report.verdict.toLowerCase().replaceAll(" ", "-");
  const shareText = [`ScamShield case ${report.id.slice(0, 8).toUpperCase()}`, `Verdict: ${report.verdict}`, `Risk score: ${report.score}/100`, `Confidence: ${Math.round(report.confidence * 100)}%`, report.summary, `Warning signs: ${[...new Set(report.signals.map((signal) => signal.tactic))].join(", ") || "None found by local rules"}`, "The original message is not included in this summary."].join("\n");
  return <motion.article className="case-report glass-strong panel-40" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} aria-labelledby="case-verdict">
    <header className="case-header">
      <div><span className="data">Case {report.id.slice(0, 8).toUpperCase()}</span><span>{new Date(report.createdAt).toLocaleString("en-GB")}</span></div>
      <div><span>{report.channel}</span><span>{getRegionPack(report.region).name}</span></div>
    </header>
    <section className={`verdict-block verdict-${verdictClass}`}>
      <motion.div className="verdict-stamp" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 340, damping: 24 }}>
        <Icon name={verdictIcon(report.verdict)} size={58} /><div><h2 id="case-verdict">{report.verdict}</h2><p>{report.summary}</p></div>
      </motion.div>
      <div className="score-block"><Gauge score={report.score} /><span>Confidence: <strong className="data">{Math.round(report.confidence * 100)}%</strong></span></div>
    </section>
    <ReportSection title="Annotated message"><AnnotatedMessage report={report} /></ReportSection>
    <ReportSection title="Links"><LinkReport report={report} pending={stage === "rules"} /></ReportSection>
    <ReportSection title="Sender">
      {report.sender ? <div className="sender-details"><p className="data">{report.sender.raw}</p>{report.sender.displayName ? <p>Display name: {report.sender.displayName}</p> : null}{report.sender.address ? <p>Address: <span className="data">{report.sender.address}</span></p> : null}</div> : <p>No sender was included. Check the sender ID or full email address in the original message.</p>}
      <p className="small muted">{getRegionPack(report.region).senderConventions.join(". ")}.</p>
    </ReportSection>
    <ReportSection title="What to do now"><ol className="action-list">{report.recommendedActions.map((action, index) => <li key={action}><span>{action}</span><CopyButton text={action} label={`Copy step ${index + 1}`} /></li>)}</ol></ReportSection>
    <ReportSection title="Why this might be wrong"><p>Rules can miss a new tactic or flag a genuine urgent request. A clean result does not prove that a sender or link is genuine. Threat sources may be unavailable or may not know a new domain. AI explanations can be incomplete, and only validated evidence spans are included.</p></ReportSection>
    <ReportSection title="What was sent to AI"><details><summary>View the redacted payload and provider results</summary>{report.redactedText ? <pre>{report.redactedText}</pre> : <p>No message text was sent to AI.</p>}<div className="provider-trace">{report.providerTrace.map((trace, index) => <div key={`${trace.provider}-${index}`}><strong>{trace.provider}</strong><span>{trace.status}</span><p>{trace.detail}</p></div>)}</div></details></ReportSection>
    {report.visualCues.length ? <ReportSection title="Screenshot cues"><ul>{report.visualCues.map((cue) => <li key={cue}>{cue}</li>)}</ul></ReportSection> : null}
    <ReportSection title="Share with someone"><p>This summary excludes the original message and its links.</p><CopyButton text={shareText} label="Copy report summary" /></ReportSection>
    <SaveReportButton report={report} />
  </motion.article>;
}
function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="report-section"><h2>{title}</h2>{children}</section>;
}
