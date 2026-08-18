import type { MetadataRoute } from "next";
import { site } from "@/site.config";

/**
 * Every agent listed here is one that actually exists and publishes its user-agent string.
 * No invented crawler names — a robots.txt full of made-up agents is noise that makes the
 * real rules harder to audit.
 *
 * AI crawlers are explicitly ALLOWED. For a local service business, being quotable by an
 * assistant answering "who does junk removal in Grand Rapids" is upside, not risk.
 */
export default function robots(): MetadataRoute.Robots {
  const agents = [
    "*", "Googlebot", "Bingbot",
    "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-User",
    "Google-Extended", "PerplexityBot", "Perplexity-User",
    "Applebot-Extended", "Meta-ExternalAgent", "Amazonbot", "CCBot",
  ];
  return {
    rules: agents.map((userAgent) => ({ userAgent, allow: "/" })),
    sitemap: `${site.seo.url}/sitemap.xml`,
    host: site.seo.url,
  };
}
