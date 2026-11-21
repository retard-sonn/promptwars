import type { MetadataRoute } from "next";
import { patterns } from "@/lib/data/patterns";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const routes = ["", "/patterns", "/practice", "/link-check", "/help", "/insights", "/methodology", "/privacy", "/auth"];
  return [...routes, ...patterns.map((pattern) => `/patterns/${pattern.slug}`)].map((route) => ({ url: `${base}${route}`, changeFrequency: "weekly", priority: route === "" ? 1 : 0.6 }));
}
