"use client";

import { useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
export function RouteWipe({ children }: { children: ReactNode }) {
  const router = useRouter();
  const sheet = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  function onClick(event: React.MouseEvent<HTMLDivElement>) {
    if (active.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const anchor = target.closest("a");
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
    event.preventDefault();
    active.current = true;
    const ease = CustomEase.create("shield-wipe", "0.16,1,0.3,1");
    gsap.timeline({ onComplete: () => { active.current = false; } })
      .set(sheet.current, { xPercent: -110, autoAlpha: 1 })
      .to(sheet.current, { xPercent: 0, duration: 0.45, ease })
      .call(() => router.push(`${url.pathname}${url.search}${url.hash}`))
      .to(sheet.current, { xPercent: 110, duration: 0.55, ease: "expo.inOut" }, "+=0.08")
      .set(sheet.current, { autoAlpha: 0 });
  }
  return <div onClickCapture={onClick}><div className="route-sheet" ref={sheet} aria-hidden="true" />{children}</div>;
}
