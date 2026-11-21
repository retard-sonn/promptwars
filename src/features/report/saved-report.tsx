"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { reportSchema, type Report } from "@/lib/contracts/report";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";
import { ReportView } from "./report-view";

const VerdictModel = dynamic(() => import("@/features/scenes/pixel-verdict"), {
  ssr: false,
});
export function SavedReport({ id }: { id: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState(!isSupabasePublicConfigured());
  const [loading, setLoading] = useState(isSupabasePublicConfigured());
  useEffect(() => {
    if (!isSupabasePublicConfigured()) return;
    let active = true;
    fetch(`/api/reports/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Report unavailable");
        return response.json();
      })
      .then((body: unknown) => {
        if (active) setReport(reportSchema.parse(body));
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (loading)
    return (
      <main className="container page-hero">
        <div className="report-loading glass-strong panel-40" role="status">
          <div className="skeleton" />
          <p>Loading the saved case.</p>
        </div>
      </main>
    );
  if (error || !report)
    return (
      <main className="container page-hero">
        <h1>Report unavailable</h1>
        <p>
          This case was not saved, the account service is not configured, or you do not
          have access to it.
        </p>
        <Link className="button" href="/">
          Run a new check
        </Link>
      </main>
    );
  return (
    <main className="container saved-report">
      <div className="saved-model">
        <VerdictModel verdict={report.verdict} />
      </div>
      <ReportView report={report} stage="complete" />
    </main>
  );
}
