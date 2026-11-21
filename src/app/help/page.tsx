import type { Metadata } from "next";
import { EmergencyFlow } from "@/features/help/emergency-flow";

export const metadata: Metadata = { title: "If you already clicked, paid or shared a code" };
export default function HelpPage() {
  return <EmergencyFlow />;
}
