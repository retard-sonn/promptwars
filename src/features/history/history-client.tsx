"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons/icon";

export type HistoryRow = {
  id: string;
  verdict: string;
  score: number;
  created_at: string;
};
export function HistoryClient({ initialRows }: { initialRows: HistoryRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [error, setError] = useState<string | null>(null);
  async function remove(id: string) {
    const response = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    if (response.ok) setRows((current) => current.filter((row) => row.id !== id));
    else setError("The report could not be deleted.");
  }
  if (!rows.length)
    return (
      <div className="insights-empty glass-tint panel-40">
        <Icon name="report" size={46} />
        <h2>No saved reports</h2>
        <p>Run a check and choose Save report when you want to keep the result.</p>
        <Link className="button" href="/">
          Check a message
        </Link>
      </div>
    );
  return (
    <div className="history-list">
      {rows.map((row) => (
        <article className="history-row glass-strong" key={row.id}>
          <div>
            <strong>{row.verdict}</strong>
            <p>{new Date(row.created_at).toLocaleString("en-GB")}</p>
          </div>
          <span className="data">{row.score}/100</span>
          <Link href={`/report/${row.id}`}>
            Open case
            <Icon name="arrow-up-right" size={20} />
          </Link>
          <button className="copy-button" onClick={() => remove(row.id)}>
            Delete
          </button>
        </article>
      ))}
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
