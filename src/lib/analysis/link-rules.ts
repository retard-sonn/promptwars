import { foldHomoglyphs } from "./normalise";
import { getRegionPack } from "./regions";
import type { AnalyzedLink, LinkFinding, RegionId, Signal, Span } from "./types";
import { registrableLabel, urlAnatomy } from "./url-anatomy";

const shorteners = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "cutt.ly",
  "rb.gy",
  "is.gd",
  "shorturl.at",
  "short.example",
]);
const suspiciousTlds = new Set([
  "top",
  "xyz",
  "click",
  "work",
  "quest",
  "monster",
  "cam",
  "rest",
]);
const ipHost = /^(?:\d{1,3}\.){3}\d{1,3}$|^\[[\da-f:]+\]$/i;

export function editDistance(left: string, right: string): number {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let previous = row[0] ?? 0;
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const saved = row[j] ?? 0;
      row[j] = Math.min(
        (row[j] ?? 0) + 1,
        (row[j - 1] ?? 0) + 1,
        previous + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
      previous = saved;
    }
  }
  return row[right.length] ?? 0;
}
function officialHost(host: string, official: string) {
  return host === official || host.endsWith(`.${official}`);
}
function normaliseUrl(raw: string) {
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Unsupported URL scheme");
  return url;
}

export function analyseLink(raw: string, span: Span, region: RegionId): AnalyzedLink {
  let url: URL;
  try {
    url = normaliseUrl(raw);
  } catch {
    return {
      raw,
      normalized: raw,
      host: "",
      span,
      anatomy: { scheme: "", subdomain: "", domain: "", tld: "", path: "" },
      findings: [
        {
          code: "invalid-url",
          label: "Incomplete or invalid URL",
          detail:
            "The URL could not be parsed. Check the complete address before visiting it.",
          weight: 12,
        },
      ],
    };
  }
  const host = foldHomoglyphs(url.hostname.toLowerCase().replace(/\.$/, ""));
  const findings: LinkFinding[] = [];
  let lookalikeOf: string | undefined;
  const add = (code: string, label: string, detail: string, weight: number) =>
    findings.push({ code, label, detail, weight });
  if (ipHost.test(host))
    add(
      "ip-host",
      "IP address host",
      "The link uses a numeric address instead of a recognisable domain.",
      30,
    );
  if (url.username || url.password)
    add(
      "at-trick",
      "Credentials before the host",
      "Text before the @ sign can look like a trusted name. The actual destination follows the @ sign.",
      40,
    );
  if (host.includes("xn--"))
    add(
      "punycode",
      "Internationalised domain",
      "Punycode can represent characters that resemble a familiar brand name.",
      35,
    );
  if (host !== foldHomoglyphs(url.hostname))
    add(
      "mixed-script",
      "Lookalike characters",
      "The host mixes characters from different writing systems.",
      45,
    );
  if (shorteners.has(host))
    add(
      "shortener",
      "Shortened link",
      "The final destination is hidden behind a link-shortening service.",
      12,
    );
  const anatomy = urlAnatomy(url);
  if (suspiciousTlds.has(anatomy.tld))
    add(
      "suspicious-tld",
      "Frequently abused suffix",
      "This low-cost domain suffix is often used for disposable phishing sites. It is not proof by itself.",
      14,
    );
  if (url.protocol === "http:")
    add(
      "http",
      "Unencrypted connection",
      "The link does not use HTTPS, so its connection can be altered more easily.",
      10,
    );
  const foldedHost = host.replace(/[^a-z0-9]/g, "");
  const label = registrableLabel(host);
  for (const brand of getRegionPack(region).brands) {
    const token = brand.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (token.length < 3 || brand.domains.some((domain) => officialHost(host, domain)))
      continue;
    for (const official of brand.domains) {
      const officialLabel = registrableLabel(official);
      const distance = editDistance(label, officialLabel);
      if (label.length >= 5 && distance > 0 && distance <= 2) {
        lookalikeOf = official;
        add(
          "lookalike-domain",
          `Similar to ${official}`,
          `The domain ${label} differs from ${official} by ${distance} character${distance === 1 ? "" : "s"}.`,
          52,
        );
        break;
      }
    }
    if (!lookalikeOf && foldedHost.includes(token)) {
      lookalikeOf = brand.domains[0];
      add(
        "brand-mismatch",
        `${brand.name} name in an unrelated domain`,
        `The destination is not the listed official domain for ${brand.name}.`,
        34,
      );
    }
    if (lookalikeOf) break;
  }
  return { raw, normalized: url.toString(), host, span, anatomy, findings, lookalikeOf };
}

export function linksToSignals(links: AnalyzedLink[]): Signal[] {
  return links.flatMap((link, linkIndex) =>
    link.findings.map((finding, findingIndex) => ({
      id: `link.${finding.code}.${linkIndex + 1}.${findingIndex + 1}`,
      tactic:
        finding.code === "brand-mismatch"
          ? ("impersonation" as const)
          : ("lookalike link" as const),
      weight: finding.weight,
      confidence:
        finding.code === "suspicious-tld" || finding.code === "shortener" ? 0.62 : 0.91,
      quote: link.raw,
      span: link.span,
      explanation: finding.detail,
      source: "link" as const,
    })),
  );
}
