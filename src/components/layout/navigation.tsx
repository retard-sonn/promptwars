"use client";

import { Dialog } from "radix-ui";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icons/icon";
import { useRegion } from "./region-provider";
import { regionIds } from "@/lib/analysis/types";
import { magnetic } from "@/lib/string-tune";

const links = [
  { href: "/", label: "Check" },
  { href: "/patterns", label: "Patterns" },
  { href: "/practice", label: "Practice" },
  { href: "/link-check", label: "Link check" },
  { href: "/insights", label: "Insights" },
];
export function Navigation() {
  const pathname = usePathname();
  const { region, setRegion } = useRegion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 120], [1, 0.96]);
  const [open, setOpen] = useState(false);
  return (
    <motion.nav className="floating-nav glass" style={{ scale }} aria-label="Main navigation">
      <Link href="/" className="wordmark" aria-label="ScamShield home">
        <Icon name="shield-check" size={26} />
        <span>ScamShield</span>
      </Link>
      <div className="nav-links">
        {links.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return <Link key={link.href} href={link.href} className="nav-link">
            {active ? <motion.span className="nav-active" layoutId="active-nav" /> : null}
            <span>{link.label}</span>
          </Link>;
        })}
      </div>
      <select className="region-select" aria-label="Region" value={region} onChange={(event) => setRegion(regionIds.find((id) => id === event.target.value) ?? "generic")}>
        <option value="in">India</option><option value="us">United States</option>
        <option value="uk">United Kingdom</option><option value="generic">Other</option>
      </select>
      <Link href="/help" className="nav-help" {...magnetic}>I already clicked</Link>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="nav-menu" aria-label="Open navigation"><Icon name="message" size={22} /></Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="sheet-overlay" />
          <Dialog.Content className="sheet-content glass-strong">
            <Dialog.Title>ScamShield</Dialog.Title>
            <Dialog.Description>Check a message or choose a page.</Dialog.Description>
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<Icon name="arrow-up-right" size={20} /></Link>)}
            <Link href="/help" onClick={() => setOpen(false)}>I already clicked<Icon name="arrow-up-right" size={20} /></Link>
            <Dialog.Close className="button button--ghost">Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </motion.nav>
  );
}
