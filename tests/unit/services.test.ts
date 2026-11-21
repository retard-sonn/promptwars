import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkUrlhaus } from "../../src/lib/intel/urlhaus";
import { runThreatChecks } from "../../src/lib/intel/run";
import { checkWebRisk } from "../../src/lib/intel/web-risk";
import { expandShortener } from "../../src/lib/intel/expand";
import { validateImage } from "../../src/lib/server/image";
import { verifyTurnstile } from "../../src/lib/server/turnstile";
import { limitRequest } from "../../src/lib/server/rate-limit";

const keys = ["URLHAUS_AUTH_KEY", "GOOGLE_WEB_RISK_API_KEY", "PHISHTANK_API_KEY", "OPENPHISH_FEED_URL", "VIRUSTOTAL_API_KEY", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "TURNSTILE_SECRET_KEY"];
const saved = new Map<string, string | undefined>();
beforeEach(() => {
  for (const key of keys) {
    saved.set(key, process.env[key]);
    delete process.env[key];
  }
});
afterEach(() => {
  for (const key of keys) {
    const value = saved.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.unstubAllGlobals();
});
describe("threat services", () => {
  it("returns every source as unavailable without keys", async () => {
    const [result] = await runThreatChecks(["https://example.com"]);
    expect(result?.results).toHaveLength(5);
    expect(result?.results.every((entry) => entry.status === "unavailable")).toBe(true);
  });
  it("parses a URLhaus match without exposing the key", async () => {
    process.env.URLHAUS_AUTH_KEY = "test-key";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ query_status: "ok", url_status: "online" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await checkUrlhaus("https://bad.example");
    expect(result.status).toBe("flagged");
    expect(result.reason).not.toContain("test-key");
  });
  it("uses the documented Web Risk GET query format", async () => {
    process.env.GOOGLE_WEB_RISK_API_KEY = "test-key";
    const fetchMock = vi.fn<typeof fetch>(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await checkWebRisk("https://clean.example");
    expect(result.status).toBe("clean");
    const requestUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(requestUrl).toContain("uri=https%3A%2F%2Fclean.example");
    expect(requestUrl).toContain("threatTypes=MALWARE");
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBeUndefined();
    expect(fetchMock.mock.calls[0]?.[1]?.body).toBeUndefined();
  });
  it("rejects private expansion targets before a request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(expandShortener("http://127.0.0.1")).rejects.toThrow("Private");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
describe("request protection", () => {
  it("skips Turnstile cleanly when unset", async () => {
    expect(await verifyTurnstile()).toEqual({ success: true, skipped: true });
  });
  it("limits anonymous callers in memory without Upstash", async () => {
    const request = new Request("http://localhost/api/analyze", { headers: { "x-real-ip": "192.0.2.44" } });
    for (let count = 0; count < 10; count += 1) expect((await limitRequest(request)).success).toBe(true);
    expect((await limitRequest(request)).success).toBe(false);
  });
  it("checks image signatures rather than trusting the declared type", async () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect((await validateImage(new File([png], "message.png", { type: "image/png" }))).mimeType).toBe("image/png");
    await expect(validateImage(new File([new Uint8Array([1, 2, 3])], "fake.png", { type: "image/png" }))).rejects.toThrow("Only PNG");
  });
});
