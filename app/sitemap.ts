import type { MetadataRoute } from "next";
import { site } from "@/site.config";

/**
 * Every public page, absolute URLs, generated at build so a new service page cannot be
 * forgotten here. Priorities are deliberately coarse — Google treats them as a hint at
 * best, and precise-looking numbers imply a confidence nobody has.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls = [
    { path: "/", priority: 1.0 },
    { path: "/junk-removal", priority: 0.9 },
    { path: "/snow-removal", priority: 0.8 },
    ...site.services
      // Both division homes are already listed explicitly above.
      .filter((s) => s.slug !== "junk-removal" && s.slug !== "snow-removal")
      .map((s) => ({ path: `/${s.slug}`, priority: 0.8 })),
    { path: "/gallery", priority: 0.6 },
    { path: "/reviews", priority: 0.6 },
    { path: "/service-areas", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy", priority: 0.2 },
  ];
  return urls.map((u) => ({
    url: `${site.seo.url}${u.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: u.priority,
  }));
}
