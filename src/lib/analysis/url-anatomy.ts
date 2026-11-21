import type { UrlAnatomy } from "./types";

export function splitHost(host: string) {
  const parts = host.toLowerCase().split(".").filter(Boolean);
  const suffix = parts.slice(-2).join(".");
  const compound = ["co.uk", "org.uk", "gov.uk", "co.in", "net.in", "org.in", "com.au"];
  const tld = compound.includes(suffix) ? suffix : parts.at(-1) ?? "";
  const domainCount = tld.split(".").length + 1;
  const domain = parts.at(-domainCount) ?? "";
  const subdomain = parts.slice(0, -domainCount).join(".");
  return { parts, tld, domain, subdomain };
}

export function urlAnatomy(url: URL): UrlAnatomy {
  const host = splitHost(url.hostname);
  return {
    scheme: url.protocol.replace(":", ""),
    subdomain: host.subdomain,
    domain: host.domain,
    tld: host.tld,
    path: `${url.pathname}${url.search}${url.hash}`,
  };
}

export function registrableLabel(host: string): string {
  return splitHost(host).domain;
}
