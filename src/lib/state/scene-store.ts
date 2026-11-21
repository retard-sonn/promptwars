import { create } from "zustand";
import type { Verdict } from "@/lib/analysis/types";

type SceneStatus = "idle" | "focused" | "checking" | "complete";
type SceneState = {
  status: SceneStatus;
  verdict: Verdict | null;
  chapterProgress: number;
  setStatus: (status: SceneStatus) => void;
  setVerdict: (verdict: Verdict | null) => void;
  setChapterProgress: (progress: number) => void;
};
export const useSceneStore = create<SceneState>((set) => ({
  status: "idle",
  verdict: null,
  chapterProgress: 0,
  setStatus: (status) => set({ status }),
  setVerdict: (verdict) => set({ verdict }),
  setChapterProgress: (chapterProgress) => set({ chapterProgress }),
}));
