import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { PageHero } from "@/components/layout/page-hero";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";
import { getOptionalUser, createSupabaseServerClient } from "@/lib/supabase/server";
import { HistoryClient, type HistoryRow } from "@/features/history/history-client";

export const metadata: Metadata = { title: "Saved reports" };
export const dynamic = "force-dynamic";
export default async function HistoryPage() {
  if (!isSupabasePublicConfigured())
    return (
      <main>
        <PageHero title="Saved reports">
          <p>
            History is unavailable because no account service is configured. Your analyses
            still work without an account.
          </p>
          <Link className="button" href="/">
            Check a message
          </Link>
        </PageHero>
      </main>
    );
  const user = await getOptionalUser();
  if (!user)
    return (
      <main>
        <PageHero title="Saved reports">
          <p>Sign in to see reports you chose to save.</p>
          <Link className="button" href="/auth">
            Sign in
          </Link>
        </PageHero>
      </main>
    );
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Account service unavailable");
  const { data, error } = await supabase
    .from("reports")
    .select("id, verdict, score, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error("History could not be loaded");
  const rows: HistoryRow[] = z
    .array(
      z.object({
        id: z.string().uuid(),
        verdict: z.string(),
        score: z.number(),
        created_at: z.string().datetime(),
      }),
    )
    .parse(data);
  return (
    <main>
      <PageHero title="Saved reports">
        <p>
          Only reports you chose to save appear here. Delete a case to remove it from your
          account.
        </p>
      </PageHero>
      <div className="container">
        <HistoryClient initialRows={rows} />
      </div>
    </main>
  );
}
