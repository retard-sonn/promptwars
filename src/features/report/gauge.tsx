"use client";

import { motion, useSpring, useTransform } from "motion/react";
import Link from "next/link";

export function Gauge({ score }: { score: number }) {
  const spring = useSpring(score, { stiffness: 300, damping: 30 });
  const rotation = useTransform(spring, [0, 100], [-90, 90]);
  return (
    <div className="gauge-wrap">
      <div className="gauge">
        <svg viewBox="0 0 200 120" aria-hidden="true">
          <path
            d="M20 105 A80 80 0 0 1 180 105"
            pathLength={100}
            className="gauge-track"
          />
          <motion.path
            d="M20 105 A80 80 0 0 1 180 105"
            pathLength={100}
            className="gauge-value"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <motion.g style={{ rotate: rotation, originX: "100px", originY: "105px" }}>
            <line x1="100" y1="105" x2="100" y2="38" className="gauge-needle" />
            <circle cx="100" cy="105" r="7" className="gauge-pin" />
          </motion.g>
        </svg>
        <strong className="data">
          {score}
          <span>/100</span>
        </strong>
      </div>
      <Link href="/methodology" className="small">
        How this score works
      </Link>
    </div>
  );
}
