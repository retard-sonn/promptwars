import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { MotionProvider } from "@/components/layout/motion-provider";
import { AmbientBackdrop } from "@/components/layout/ambient-backdrop";
import { SiteFrame } from "@/components/layout/site-frame";
import "./globals.css";
import "./ambient.css";
import "./layout.css";
import "./route-motion.css";
import "./pages.css";
import "./account.css";
import "@/features/scenes/pixel.css";
import "@/features/home/home.css";
import "@/features/home/home-sections.css";
import "@/features/home/motion.css";
import "@/features/home/story-district.css";
import "@/features/report/report.css";
import "@/features/report/report-actions.css";
import "@/features/insights/insights.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  axes: ["opsz"],
  display: "optional",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "ScamShield", template: "%s | ScamShield" },
  description:
    "Check suspicious messages, understand warning signs and choose what to do next.",
  openGraph: {
    title: "ScamShield",
    description: "Warning signs, link inspection and what to do next.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScamShield",
    description: "Check suspicious messages and understand the warning signs.",
  },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <MotionProvider>
          <AmbientBackdrop />
          <SiteFrame>{children}</SiteFrame>
        </MotionProvider>
      </body>
    </html>
  );
}
