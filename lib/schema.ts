import { site } from "@/site.config";

/**
 * Structured data builders.
 *
 * HARD RULES
 *   - NEVER emit Review or AggregateRating. Self-serving review markup is a penalty risk.
 *   - NEVER emit a property whose value is not a confirmed fact AND visible on the page.
 *   - NO `address`. This is a service-area business and no street address is published.
 *   - Every @type must be a real schema.org type. There is no "JunkRemovalService" — the
 *     correct type for this business is LocalBusiness, used deliberately rather than
 *     inventing a subtype that would be silently ignored or flagged.
 *
 * `openingHoursSpecification` IS emitted, unusually for these builds, because the hours
 * are confirmed (Mon-Sat 7am-7pm) and are printed in the footer on every page.
 */

const BUSINESS_ID = `${site.seo.url}/#business`;
const WEBSITE_ID = `${site.seo.url}/#website`;
const ORG_ID = `${site.seo.url}/#organization`;

/** Real profile URLs only. Empty config entries never reach sameAs. */
function sameAs(): string[] {
  return [
    site.business.social.facebook,
    site.business.social.instagram,
    site.business.social.google,
  ].filter((u) => u.length > 0);
}

export function localBusinessSchema() {
  const s = sameAs();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: site.business.name,
    url: site.seo.url,
    telephone: `+${site.business.phoneHref.replace(/\D/g, "")}`,
    email: site.business.email,
    slogan: site.business.tagline,
    description: site.seo.pages.home.description,
    areaServed: [
      ...site.geo.counties.map((name) => ({ "@type": "AdministrativeArea", name })),
      ...site.geo.cities.map((name) => ({ "@type": "Place", name })),
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...site.business.hours.days],
        opens: site.business.hours.opens,
        closes: site.business.hours.closes,
      },
    ],
    ...(s.length ? { sameAs: s } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.seo.url,
    name: site.seo.siteName,
    publisher: { "@id": BUSINESS_ID },
  };
}

export function organizationSchema() {
  const s = sameAs();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.business.name,
    url: site.seo.url,
    ...(s.length ? { sameAs: s } : {}),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.seo.url}${item.path}`,
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: `${site.seo.url}${opts.path}`,
    provider: { "@id": BUSINESS_ID },
    areaServed: site.geo.counties.map((name) => ({ "@type": "AdministrativeArea", name })),
  };
}

/**
 * FAQPage. `faqs` MUST be exactly the questions rendered visibly on that page — pass the
 * same array the component renders, never a superset.
 */
export function faqSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
