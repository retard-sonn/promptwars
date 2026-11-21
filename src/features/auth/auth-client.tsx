"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabasePublicConfigured } from "@/lib/supabase/config";

export function AuthClient() {
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void createSupabaseBrowserClient().then(async (supabase) => {
      const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
      setUserEmail(data.user?.email ?? null);
    });
  }, []);
  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    const supabase = await createSupabaseBrowserClient();
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    setMessage(error ? "The sign-in link could not be sent. Check the address and try again." : "Check your email for the sign-in link.");
    setBusy(false);
  }
  async function signOut() {
    const supabase = await createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setUserEmail(null);
  }
  return <main><PageHero title="Your account"><p>Analysis works without an account. An account is only needed to save reports and view history.</p></PageHero><section className="auth-panel glass-strong panel-40 container">
    {!isSupabasePublicConfigured() ? <><h2>Account service unavailable</h2><p>No Supabase project is configured. Saving and history are hidden, and every analysis still works without signing in.</p><Link className="button" href="/">Check a message</Link></> : userEmail ? <><h2>Signed in as {userEmail}</h2><div className="auth-actions"><Link className="button" href="/history">View saved reports</Link><button className="button button--ghost" onClick={signOut}>Sign out</button></div></> : <form onSubmit={signIn}><label htmlFor="auth-email">Email address</label><input id="auth-email" className="input" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><button className="button" disabled={busy}>{busy ? "Sending link" : "Send a sign-in link"}</button></form>}
    {message ? <p role="status">{message}</p> : null}
  </section></main>;
}
