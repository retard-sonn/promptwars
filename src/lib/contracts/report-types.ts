import type { z } from "zod";
import type { urlThreatSchema } from "./report";

export { reportSchema, threatResultSchema } from "./report";
export type { ThreatResult, Report, ProviderTrace } from "./report";
export type UrlThreat = z.infer<typeof urlThreatSchema>;
