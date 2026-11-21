import "server-only";
import { z } from "zod";
import { getServerEnv } from "./env";

const resultSchema = z.object({ success: z.boolean(), "error-codes": z.array(z.string()).optional() });
export async function verifyTurnstile(token?: string) {
  const secret = getServerEnv().TURNSTILE_SECRET_KEY;
  if (!secret) return { success: true, skipped: true };
  if (!token) return { success: false, skipped: false };
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    const result = resultSchema.parse(await response.json());
    return { success: result.success, skipped: false };
  } catch {
    return { success: false, skipped: false };
  }
}
