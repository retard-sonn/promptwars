import type { Report } from "@/lib/contracts/report";
import { Icon } from "@/components/icons/icon";

export function LinkReport({ report, pending }: { report: Report; pending: boolean }) {
  if (!report.links.length) return <p>No links were found in this message.</p>;
  return <div className="link-reports">
    {report.links.map((link, index) => {
      const threats = report.threats.find((entry) => entry.url === link.normalized || entry.url === link.expandedUrl);
      return <article className="link-report" key={`${link.normalized}-${index}`}>
        <h3 className="data">{link.host || "Invalid URL"}</h3>
        <div className="url-anatomy">
          {Object.entries(link.anatomy).map(([part, value]) => <div key={part}><span>{part}</span><code>{value || "(none)"}</code></div>)}
        </div>
        {link.lookalikeOf ? <p className="lookalike"><Icon name="loupe" size={20} />Compared with the official domain: <strong className="data">{link.lookalikeOf}</strong></p> : null}
        {link.expandedUrl ? <p className="small">Resolved destination: <span className="data">{link.expandedUrl}</span></p> : null}
        <ul className="finding-list">{link.findings.map((finding) => <li key={finding.code}><strong>{finding.label}</strong><p>{finding.detail}</p></li>)}</ul>
        <div className="threat-list" aria-label="Threat source results">
          {(threats?.results ?? []).map((result) => <div className={`threat-row threat-${result.status}`} key={result.source}><strong>{result.source}</strong><span>{result.status === "unavailable" ? "Not checked" : result.status}</span><p>{result.reason}</p></div>)}
        </div>
      </article>;
    })}
    {pending ? <p role="status">Threat source checks are still running.</p> : null}
  </div>;
}
