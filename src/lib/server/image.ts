import "server-only";
import type { LlmImage } from "@/lib/llm/schemas";

function mimeFromBytes(bytes: Uint8Array): LlmImage["mimeType"] | null {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}
export async function validateImage(file: File): Promise<LlmImage> {
  if (file.size > 5 * 1024 * 1024) throw new Error("Images must be 5MB or smaller");
  const data = Buffer.from(await file.arrayBuffer());
  const mimeType = mimeFromBytes(data);
  if (!mimeType) throw new Error("Only PNG, JPEG and WebP images are supported");
  return { data, mimeType };
}
