import type { Metadata } from "next";
import { LinkCheckClient } from "@/features/link-check/link-check-client";

export const metadata: Metadata = { title: "Link check" };
export default function LinkCheckPage() {
  return <LinkCheckClient />;
}
