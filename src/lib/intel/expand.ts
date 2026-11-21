import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

function privateIpv4(address: string) {
  const parts = address.split(".").map(Number);
  const [a = 0, b = 0] = parts;
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19 || b === 51)) || (a === 203 && b === 0);
}
function privateAddress(address: string) {
  if (isIP(address) === 4) return privateIpv4(address);
  const folded = address.toLowerCase();
  return folded === "::" || folded === "::1" || folded.startsWith("fc") || folded.startsWith("fd") || folded.startsWith("fe8") || folded.startsWith("fe9") || folded.startsWith("fea") || folded.startsWith("feb") || folded.startsWith("ff") || folded.startsWith("::ffff:");
}
async function assertPublic(raw: string) {
  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS are allowed");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("Only ports 80 and 443 are allowed");
  if (url.username || url.password) throw new Error("Credentials are not allowed in expanded URLs");
  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => privateAddress(address))) throw new Error("Private or local network addresses are blocked");
  return url;
}
export async function expandShortener(raw: string) {
  let current = raw;
  for (let hop = 0; hop < 5; hop += 1) {
    const url = await assertPublic(current);
    const response = await fetch(url, { method: "HEAD", redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(3000), headers: { accept: "*/*" } });
    if (response.status < 300 || response.status >= 400) return { finalUrl: url.toString(), status: response.status, hops: hop };
    const location = response.headers.get("location");
    if (!location) throw new Error("Redirect had no destination");
    current = new URL(location, url).toString();
  }
  throw new Error("The redirect limit of 5 hops was reached");
}
