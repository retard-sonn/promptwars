import "server-only";
import { PostHog } from "posthog-node";
import { getServerEnv } from "@/lib/server/env";

const allowedEvents = new Set([
  "analysis_completed",
  "link_check_completed",
  "report_saved",
  "practice_completed",
  "emergency_checklist_created",
]);
const allowedProperties = new Set([
  "region",
  "channel",
  "verdict",
  "scoreBand",
  "provider",
  "source",
  "status",
  "count",
]);
type EventProperties = Record<string, string | number>;
export async function trackServerEvent(name: string, properties: EventProperties = {}) {
  const env = getServerEnv();
  if (!allowedEvents.has(name) || !env.POSTHOG_API_KEY) return;
  const clean = Object.fromEntries(
    Object.entries(properties).filter(([key]) => allowedProperties.has(key)),
  );
  const posthog = new PostHog(env.POSTHOG_API_KEY, { host: env.POSTHOG_HOST });
  posthog.capture({ distinctId: "anonymous", event: name, properties: clean });
  await posthog.shutdown();
}
