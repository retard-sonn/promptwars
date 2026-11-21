"use client";

import { useEffect } from "react";

export function AmbientMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup: (() => void) | undefined;
    const pointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    const delay = (() => {
      try {
        return sessionStorage.getItem("scamshield:intro") === "seen" ? 0 : 9000;
      } catch {
        return 9000;
      }
    })();
    const timer = setTimeout(() => {
      void import("@fiddle-digital/string-tune").then(({ StringTune, StringParallax, StringMagnetic, StringProgress }) => {
      const tune = StringTune.getInstance();
      tune.scrollDesktopMode = "default";
      tune.scrollMobileMode = "default";
      tune.use(StringParallax);
      tune.use(StringMagnetic);
      tune.use(StringProgress);
      tune.start(60);
      cleanup = () => tune.destroy();
    });
    }, delay);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", pointer);
      cleanup?.();
    };
  }, []);
  return null;
}
