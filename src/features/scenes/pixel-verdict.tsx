"use client";

import type { Verdict } from "@/lib/analysis/types";

export default function PixelVerdict({ verdict }: { verdict: Verdict }) {
  return (
    <svg
      className="pixel-verdict"
      viewBox="0 0 420 260"
      shapeRendering="crispEdges"
      data-verdict={verdict}
      aria-hidden="true"
    >
      <rect
        x="52"
        y="56"
        width="210"
        height="130"
        rx="18"
        fill="rgba(255,255,255,0.85)"
        stroke="var(--ink)"
        strokeWidth="4"
      />
      <rect x="76" y="82" width="100" height="16" fill="var(--persimmon-300" />
      <rect x="76" y="120" width="150" height="10" fill="var(--ink)" opacity="0.55" />
      <rect x="76" y="146" width="112" height="10" fill="var(--persimmon-600" />
      <path
        d="M278 60h56v20h20v62h-20v34h-20v20h-20v20h-20v-20h-20v-34h-20V80h20V60Z"
        fill="var(--persimmon-400)"
        stroke="var(--ink)"
        strokeWidth="5"
      />
    </svg>
  );
}
