"use client";

import type { ReactNode } from "react";
import type { Report } from "@/lib/contracts/report";

export function AnnotatedMessage({ report }: { report: Report }) {
  const signals = [...report.signals].sort(
    (a, b) => a.span.start - b.span.start || b.weight - a.weight,
  );
  const nodes: ReactNode[] = [];
  let cursor = 0;
  signals.forEach((signal, index) => {
    if (signal.span.start < cursor || signal.span.end > report.message.length) return;
    if (signal.span.start > cursor)
      nodes.push(report.message.slice(cursor, signal.span.start));
    const rowId = `tactic-${index + 1}`;
    nodes.push(
      <button
        type="button"
        className="signal-span"
        key={`${signal.id}-${index}`}
        title={signal.tactic}
        onClick={() =>
          document
            .getElementById(rowId)
            ?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      >
        {signal.quote}
      </button>,
    );
    cursor = signal.span.end;
  });
  if (cursor < report.message.length) nodes.push(report.message.slice(cursor));
  return (
    <>
      <div className="annotated-message">{nodes.length ? nodes : report.message}</div>
      <div className="tactic-list">
        {report.signals.map((signal, index) => (
          <MotionRow
            key={`${signal.id}-${index}`}
            id={`tactic-${index + 1}`}
            index={index}
            signal={signal}
          />
        ))}
      </div>
    </>
  );
}
import { motion } from "motion/react";
function MotionRow({
  signal,
  id,
  index,
}: {
  signal: Report["signals"][number];
  id: string;
  index: number;
}) {
  return (
    <motion.article
      className="tactic-row"
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
    >
      <div>
        <h3>{signal.tactic}</h3>
        <span className="data small">
          {Math.round(signal.confidence * 100)}% confidence
        </span>
      </div>
      <blockquote>{signal.quote}</blockquote>
      <p>{signal.explanation}</p>
    </motion.article>
  );
}
