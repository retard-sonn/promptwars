"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import type { Report } from "@/lib/contracts/report";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";
import { trackClientEvent } from "@/lib/analytics/client";

export function SaveReportButton({ report }: { report: Report }) {
  const [storeRedacted, setStoreRedacted] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!isSupabasePublicConfigured()) return <p className="small muted">Saving is unavailable until an account service is configured. This result has not been saved.</p>;
  async function save() {
    setBusy(true);
    setError(null);
    const response = await fetch("/api/reports", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ report, storeRedacted }) });
    const body: unknown = await response.json();
    if (response.ok) {
      setSavedId(z.object({ id: z.string().uuid() }).parse(body).id);
      trackClientEvent("report_saved", { region: report.region, verdict: report.verdict, scoreBand: `${Math.floor(report.score / 25) * 25}` });
    }
    else setError(z.object({ error: z.object({ message: z.string() }) }).safeParse(body).data?.error.message ?? "The report could not be saved.");
    setBusy(false);
  }
  if (savedId) return <p role="status">Report saved. <Link href={`/report/${savedId}`}>Open the saved case</Link>.</p>;
  return <div className="save-controls"><label><input type="checkbox" checked={storeRedacted} onChange={(event) => setStoreRedacted(event.target.checked)} /> Store redacted message text</label><button className="button" onClick={save} disabled={busy}>{busy ? "Saving report" : "Save report"}</button>{error ? <p className="form-error" role="alert">{error}</p> : null}</div>;
}
