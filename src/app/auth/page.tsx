import type { Metadata } from "next";
import { AuthClient } from "@/features/auth/auth-client";

export const metadata: Metadata = { title: "Account" };
export default function AuthPage() {
  return <AuthClient />;
}
