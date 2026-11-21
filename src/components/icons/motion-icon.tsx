"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { IconName } from "./definitions";
import { Icon } from "./icon";

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger);
export function MotionIcon({ name, size = 24 }: { name: IconName; size?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(ref.current?.querySelectorAll(".icon-stroke") ?? [], {
      drawSVG: 0,
      duration: 0.8,
      scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
    });
  }, { scope: ref });
  return (
    <motion.span
      ref={ref}
      className="motion-icon"
      whileHover={{ rotate: -4, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Icon name={name} size={size} />
    </motion.span>
  );
}
