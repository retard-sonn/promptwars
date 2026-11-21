"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics/client";

export function Analytics() {
  useEffect(() => initAnalytics(), []);
  return null;
}
