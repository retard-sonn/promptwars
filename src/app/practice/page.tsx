import type { Metadata } from "next";
import { PracticeClient } from "@/features/practice/practice-client";

export const metadata: Metadata = { title: "Practice spotting scams" };
export default function PracticePage() {
  return <PracticeClient />;
}
