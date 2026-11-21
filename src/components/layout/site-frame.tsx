import type { ReactNode } from "react";
import Link from "next/link";
import { RegionProvider } from "./region-provider";
import { Navigation } from "./navigation";
import { AmbientMotion } from "./ambient-motion";
import { RouteWipe } from "./route-wipe";
import { Analytics } from "./analytics";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <RegionProvider>
      <Navigation />
      <AmbientMotion />
      <Analytics />
      <RouteWipe>{children}</RouteWipe>
      <footer className="site-footer container">
        <strong>ScamShield</strong>
        <p>Rule-based checks with optional AI explanations and threat sources. Results need independent verification.</p>
        <nav aria-label="Footer"><Link href="/methodology">Methodology</Link><Link href="/privacy">Privacy</Link><Link href="/history">History</Link><Link href="/help">Emergency help</Link></nav>
      </footer>
    </RegionProvider>
  );
}
