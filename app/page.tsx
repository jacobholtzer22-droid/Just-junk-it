import Link from "next/link";
import { ArrowRight, Phone, MessageSquare, Snowflake, Trash2 } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import Photo from "@/components/Photo";
import TelLink, { SmsLink } from "@/components/TelLink";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata("home");

const ICONS = { junk: Trash2, snow: Snowflake } as const;

/**
 * Two-way chooser between the junk and snow divisions.
 *
 * DESIGN NOTE — why this still converts:
 *   An interstitial before the content is normally a conversion tax, so this one is built
 *   to cost as little as possible. The phone and text buttons sit ABOVE the two panels, so
 *   a visitor who just wants to call never has to choose a division at all. Each panel is a
 *   full-height link with a ~50vh target on a phone, which is unmissable with a thumb.
 *
 * SEO NOTE:
 *   This page's title is brand-led, not keyword-led. The junk keywords belong to
 *   /junk-removal, which is the real landing page and the Google Ads destination. If both
 *   pages chased "junk removal grand rapids" they would compete with each other.
 *
 * The snow panel has no photograph because no snow photography exists. It renders as a
 * type-and-colour panel instead — a deliberate design choice, not a hole where an image
 * failed to load, and emphatically not a stock winter photo.
 */
export default function ChooserPage() {
  const { business, divisions } = site;

  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <h1 className="text-display-sm sm:text-display-lg">{business.name}</h1>
        <p className="mt-5 font-display text-2xl uppercase text-accent sm:text-3xl">
          {business.tagline}
        </p>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70">
          Locally owned in {business.city}, {business.state}, serving {site.geo.region}.
          Pick what you need, or just call — you will get {business.ownerFirstName}, the
          person who actually shows up.
        </p>

        {/* Above the chooser on purpose: nobody should have to pick a division to call. */}
        <div className="mt-8 grid gap-3 sm:max-w-lg sm:grid-cols-2">
          <TelLink className="btn-accent px-6 py-4 text-xl">
            <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            {business.phoneDisplay}
          </TelLink>
          <SmsLink className="btn-outline px-6 py-4 text-xl">
            <MessageSquare className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            Text us
          </SmsLink>
        </div>
      </section>

      <section aria-labelledby="divisions-heading" className="border-t-2 border-paper/10">
        <h2 id="divisions-heading" className="sr-only">
          Choose a service
        </h2>
        <ul className="grid gap-px bg-paper/10 md:grid-cols-2">
          {divisions.map((d) => {
            const Icon = ICONS[d.key as keyof typeof ICONS];
            return (
              <li key={d.key} className="bg-ink">
                <Link
                  href={d.href}
                  className="group relative flex min-h-[52vh] flex-col justify-end overflow-hidden p-7 sm:p-10 md:min-h-[62vh]"
                >
                  {d.photoKey ? (
                    <>
                      <div className="absolute inset-0">
                        <Photo
                          photoKey={d.photoKey}
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="h-full w-full object-cover opacity-45 transition-opacity duration-300 group-hover:opacity-60"
                        />
                      </div>
                      {/* Keeps the type readable over any part of the photo. */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25"
                      />
                    </>
                  ) : null}

                  <div className="relative">
                    <Icon className="h-10 w-10 text-accent" strokeWidth={1.75} aria-hidden="true" />
                    <p className="mt-4 font-display text-sm uppercase tracking-[0.25em] text-paper/55">
                      {d.available}
                    </p>
                    <h3 className="mt-2 text-display-sm sm:text-display-md">{d.title}</h3>
                    <p className="mt-3 max-w-sm text-lg leading-relaxed text-paper/75">
                      {d.tagline}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-display text-xl uppercase tracking-wide text-accent">
                      {d.title}
                      <ArrowRight
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />
    </main>
  );
}
