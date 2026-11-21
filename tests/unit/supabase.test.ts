import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { assertReportOwner } from "../../src/lib/server/access";
import { mapStoredReport, type StoredReportRow } from "../../src/lib/supabase/reports";
import { POST as saveReport } from "../../src/app/api/reports/route";
import { POST as submitCommunity } from "../../src/app/api/community-reports/route";

const migration = readFileSync(
  new URL("../../supabase/migrations/20261121120000_scamshield.sql", import.meta.url),
  "utf8",
);
const envKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];
const saved = new Map<string, string | undefined>();
beforeEach(() => {
  for (const key of envKeys) {
    saved.set(key, process.env[key]);
    delete process.env[key];
  }
});
afterEach(() => {
  for (const key of envKeys) {
    const value = saved.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});
describe("Supabase migration", () => {
  it("restricts every report operation to the owner", () => {
    for (const operation of ["select", "insert", "delete"])
      expect(migration).toContain(`reports_${operation}_own`);
    expect(migration).toContain("(select auth.uid()) = user_id");
    expect(migration).not.toContain("raw_user_meta_data");
  });
  it("keeps community submissions private and aggregates small groups out", () => {
    expect(migration).not.toContain("community_submissions_select");
    expect(migration).toContain("security_invoker = true");
    expect(migration).toContain("having count(*) >= 5");
  });
  it("uses current storage ownership and update policies", () => {
    expect(migration).toContain("owner_id = (select auth.uid()::text)");
    expect(migration).toContain("screenshots_update_own");
    expect(migration).not.toContain("owner = (select auth.uid()");
  });
});
describe("cross-owner access checks", () => {
  it("allows the owner and rejects another user or a null owner", () => {
    expect(() => assertReportOwner("user-a", "user-a")).not.toThrow();
    expect(() => assertReportOwner("user-a", "user-b")).toThrow("forbidden");
    expect(() => assertReportOwner("user-a", null)).toThrow("forbidden");
  });
  it("does not invent original message content when it was not saved", () => {
    const row: StoredReportRow = {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      channel: "sms",
      region: "in",
      verdict: "Suspicious",
      score: 30,
      confidence: 0.5,
      summary: "Example",
      signals: [],
      urls: { links: [], threats: [] },
      message_redacted: null,
      provider_trace: [],
      created_at: new Date().toISOString(),
    };
    expect(mapStoredReport(row).message).toBe("The original message was not saved.");
  });
  it("returns a clear unavailable response without configured services", async () => {
    const request = new Request("http://localhost/api/reports", {
      method: "POST",
      body: "{}",
    });
    expect((await saveReport(request)).status).toBe(503);
    expect((await submitCommunity(request)).status).toBe(503);
  });
});
