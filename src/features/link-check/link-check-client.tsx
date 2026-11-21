"use client";

import { useState } from "react";
import { z } from "zod";
import { Icon } from "@/components/icons/icon";
import { PageHero } from "@/components/layout/page-hero";
import { useRegion } from "@/components/layout/region-provider";
import { reportSchema, type Report } from "@/lib/contracts/report";
import { getRegionPack } from "@/lib/analysis/regions";
import { ReportView } from "@/features/report/report-view";

const responseSchema = z.object({ report: reportSchema });
export function LinkCheckClient() {
  const { region } = useRegion();
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch("/api/link-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim(), region }),
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        const message = z
          .object({ error: z.object({ message: z.string() }) })
          .parse(body);
        throw new Error(message.error.message);
      }
      setReport(responseSchema.parse(body).report);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The link check failed.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
      <PageHero title="Check a link">
        <p>
          Inspect its destination, lookalike characters and optional threat sources. No
          page content is fetched.
        </p>
      </PageHero>
      <div className="container link-check-layout">
        <form className="standalone-check glass-strong panel-40" onSubmit={submit}>
          <label htmlFor="standalone-url">URL</label>
          <div className="url-input-row">
            <input
              id="standalone-url"
              className="input data"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://paypa1.example/login"
            />
            <button className="button" disabled={loading || !url.trim()}>
              <Icon name="link" size={20} />
              {loading ? "Checking link" : "Check link"}
            </button>
          </div>
          <button
            className="chip"
            type="button"
            onClick={() => setUrl("https://paypa1.example/login")}
          >
            Use a lookalike example
          </button>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
        <aside className="link-notes glass-tint panel-28">
          <h2>What this check does</h2>
          <ul>
            <li>Separates the scheme, host and path.</li>
            <li>
              Compares the host with official domains for {getRegionPack(region).name}.
            </li>
            <li>Checks up to five optional threat sources.</li>
            <li>Uses HEAD only if shortener expansion is enabled.</li>
          </ul>
        </aside>
      </div>
      <div className="container">
        {loading ? (
          <div className="report-loading glass-strong panel-40" role="status">
            <div className="skeleton" />
            <p>Inspecting the URL and threat sources.</p>
          </div>
        ) : report ? (
          <ReportView report={report} stage="complete" />
        ) : null}
      </div>
    </main>
  );
}
