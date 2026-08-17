import type { Metadata } from "next";
import { site } from "@/site.config";

type PageKey = keyof typeof site.seo.pages;

/**
 * Per-page Metadata, straight off site.config.
 *
 * Titles are measured to 50-60 chars and descriptions to 140-160, RENDERED. There is
 * deliberately no Next title template on this site, so what is written in config is
 * exactly what ships — no hidden " | Just Junk It" suffix silently pushing a title past
 * Google's display cutoff.
 */
export function pageMetadata(key: PageKey): Metadata {
  const page = site.seo.pages[key];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
      siteName: site.seo.siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}
