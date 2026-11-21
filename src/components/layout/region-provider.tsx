"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { RegionId } from "@/lib/analysis/types";

type RegionContextValue = { region: RegionId; setRegion: (region: RegionId) => void };
const RegionContext = createContext<RegionContextValue | null>(null);
export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<RegionId>("in");
  const value = useMemo(() => ({ region, setRegion }), [region]);
  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}
export function useRegion() {
  const value = useContext(RegionContext);
  if (!value) throw new Error("useRegion must be used within RegionProvider");
  return value;
}
