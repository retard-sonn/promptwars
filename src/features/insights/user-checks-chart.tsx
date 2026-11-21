"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Icon } from "@/components/icons/icon";

const RechartsChart = dynamic(() => import("./recharts-chart"), {
  ssr: false,
  loading: () => <div className="skeleton user-chart" role="status">Loading your chart</div>,
});
export type CheckPoint = { date: string; score: number };
export function UserChecksChart({ points }: { points: CheckPoint[] }) {
  if (!points.length) return <div className="insights-empty glass-tint panel-40"><Icon name="report" size={46} /><h2>Your checks will appear here</h2><p>Sign in and save a report to see your own scores over time. No global usage statistics are shown.</p><Link className="button" href="/auth">Sign in</Link></div>;
  return <RechartsChart points={points} />;
}
