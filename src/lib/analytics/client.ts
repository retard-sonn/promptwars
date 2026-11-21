"use client";

const allowedEvents = new Set([
  "report_saved",
  "practice_completed",
  "emergency_checklist_created",
]);
const allowedProperties = new Set(["region", "verdict", "scoreBand", "count"]);
let initialized = false;
export function initAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (initialized || !key) return;
  initialized = true;
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      person_profiles: "identified_only",
    });
  });
}
export function trackClientEvent(
  name: string,
  properties: Record<string, string | number> = {},
) {
  if (!initialized || !allowedEvents.has(name)) return;
  const clean = Object.fromEntries(
    Object.entries(properties).filter(([key]) => allowedProperties.has(key)),
  );
  void import("posthog-js").then(({ default: posthog }) => posthog.capture(name, clean));
}
