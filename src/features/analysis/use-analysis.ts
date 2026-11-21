"use client";

import { useState } from "react";
import { z } from "zod";
import { streamEventSchema, type Report } from "@/lib/contracts/report";
import type { Channel, RegionId } from "@/lib/analysis/types";
import { useSceneStore } from "@/lib/state/scene-store";

export type AnalysisStage = "idle" | "waiting" | "rules" | "links" | "ai" | "complete" | "error";
type AnalyzeInput = { message: string; region: RegionId; channel: Channel; image?: File; turnstileToken?: string };
const errorSchema = z.object({ error: z.object({ message: z.string() }) });
export function useAnalysis() {
  const [report, setReport] = useState<Report | null>(null);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const { setStatus, setVerdict } = useSceneStore();
  async function analyze(input: AnalyzeInput) {
    setStage("waiting");
    setError(null);
    setReport(null);
    setStatus("checking");
    setVerdict(null);
    try {
      const hasImage = Boolean(input.image);
      const response = await fetch("/api/analyze", hasImage ? {
        method: "POST",
        body: (() => { const form = new FormData(); form.set("region", input.region); form.set("channel", input.channel); if (input.turnstileToken) form.set("turnstileToken", input.turnstileToken); if (input.image) form.set("image", input.image); return form; })(),
      } : {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const parsed = errorSchema.safeParse(await response.json());
        throw new Error(parsed.success ? parsed.data.error.message : "The check could not be completed.");
      }
      if (!response.body) throw new Error("The analysis stream is unavailable in this browser.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;
      while (!done) {
        const next = await reader.read();
        done = next.done;
        buffer += decoder.decode(next.value, { stream: !done });
        let newline = buffer.indexOf("\n");
        while (newline >= 0) {
          const line = buffer.slice(0, newline).trim();
          buffer = buffer.slice(newline + 1);
          if (line) {
            const event = streamEventSchema.parse(JSON.parse(line));
            if (event.stage === "error") throw new Error(event.error);
            setReport(event.report);
            setStage(event.stage);
            if (event.stage === "ai" || event.stage === "complete") {
              setVerdict(event.report.verdict);
              setStatus("complete");
            }
          }
          newline = buffer.indexOf("\n");
        }
      }
      setStage("complete");
    } catch (caught) {
      setStage("error");
      setStatus("idle");
      setError(caught instanceof Error ? caught.message : "The check could not be completed.");
    }
  }
  return { analyze, report, stage, error };
}
