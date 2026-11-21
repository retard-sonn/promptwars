"use client";

import { useSceneStore } from "@/lib/state/scene-store";

export function PixelIntercept() {
  const { status, verdict } = useSceneStore();
  return <svg className="pixel-scene" viewBox="0 0 520 520" shapeRendering="crispEdges" data-state={status} data-verdict={verdict} aria-hidden="true">
    <rect x="330" y="20" width="140" height="140" fill="var(--persimmon-200)" />
    <rect x="30" y="360" width="120" height="120" fill="var(--persimmon-100)" />
    <g className="pixel-card">
      <rect x="100" y="120" width="320" height="210" rx="24" fill="rgba(255,255,255,0.88)" stroke="var(--ink)" strokeWidth="4" />
      <rect x="126" y="150" width="110" height="18" fill="var(--persimmon-300" />
      <rect x="126" y="194" width="238" height="12" fill="var(--ink)" opacity="0.75" />
      <rect x="126" y="220" width="202" height="12" fill="var(--ink)" opacity="0.48" />
      <rect x="126" y="262" width="160" height="12" fill="var(--persimmon-600)" />
      <rect x="126" y="292" width="100" height="10" fill="var(--persimmon-300" />
      <rect className="pixel-scan" x="112" y="132" width="12" height="186" fill="var(--persimmon-500)" opacity="0.5" />
    </g>
    <g className="pixel-shield">
      <path d="M360 282h64v24h24v80h-24v40h-24v24h-24v24h-24v-24h-24v-24h-24v-40h-24v-80h24v-24h64Z" fill="var(--persimmon-400)" stroke="var(--ink)" strokeWidth="5" />
      <path d="M330 352h24v24h24v-48h24v72h-24v24h-24v-24h-24Z" fill="var(--ink)" />
    </g>
    <path className="pixel-hook" d="M86 250h16v120h16v32h16v16h32v-16h16v-32h16v-16h16v32h-16v32h-16v32h-48v-16h-16v-32h-16v-48H86Z" fill="var(--persimmon-600)" />
    <rect className="pixel-loupe" x="150" y="130" width="60" height="60" fill="none" stroke="var(--persimmon-600)" strokeWidth="8" />
  </svg>;
}
