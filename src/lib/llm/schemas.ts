import { z } from "zod";

export const llmExplanationSchema = z.object({
  tactics: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        evidence: z.object({
          quote: z.string().min(1).max(500),
          start: z.number().int().nonnegative(),
          end: z.number().int().positive(),
        }),
        explanation: z.string().min(1).max(800),
        confidence: z.number().min(0).max(1),
      }),
    )
    .max(12),
  impersonatedEntity: z.string().max(160).nullable(),
  inferredIntent: z.string().min(1).max(500),
  plainSummary: z.string().min(1).max(1000),
  recommendedActions: z.array(z.string().min(1).max(300)).max(10),
});
export const screenshotReadSchema = z.object({
  text: z.string().max(12000),
  sender: z.string().max(300),
  links: z.array(z.string().max(2048)).max(10),
  visualCues: z.array(z.string().max(300)).max(10),
});
export type LlmExplanation = z.infer<typeof llmExplanationSchema>;
export type ScreenshotRead = z.infer<typeof screenshotReadSchema>;
export type LlmImage = {
  data: Buffer;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
};
export type LlmProvider = {
  name: "Gemini" | "Bedrock";
  model: string;
  explain(redactedText: string, signal?: AbortSignal): Promise<LlmExplanation>;
  readScreenshot(image: LlmImage, signal?: AbortSignal): Promise<ScreenshotRead>;
};
