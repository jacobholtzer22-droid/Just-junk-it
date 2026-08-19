import Link from "next/link";
import { ArrowRight, Phone, MessageSquare, Snowflake, Trash2 } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import Photo from "@/components/Photo";
import TelLink, { SmsLink } from "@/components/TelLink";
import ScrollReveal from "@/components/ScrollReveal";
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
 *   full-height link with a large thumb target on a phone.
 *
 * AUG 2026 REFINEMENT:
 *   - H1 names both services and the city (site.chooser.h1) — the brand name lives in the
 *     logo, not the headline. Tagline stays VERBATIM (client brand asset).
 *   - Hero is deliberately compact so the division panels crest the fold at 1280x800.
 *   - Panel photos read at full strength; text sits on a bottom gradient SCRIM
 *     (ink 95% -> 50% -> 0%), not a flat darkening of the whole image.
 *   - Hero renders immediately — no entrance animation above the fold. The panels reveal
 *     on scroll (staggered) only when they start off-screen; ScrollReveal renders
 *     anything already in view statically.
 */
export default function ChooserPage() {
  const { business, divisions, chooser } = site;

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-9 sm:px-6 sm:py-11 md:grid-cols-[1fr_auto]">
        <div>
          {/* Fluid below `sm`: a fixed 2.75rem put the H1 at 5 lines on a 320px screen.
              clamp keeps it 3 lines from 320 through 390, then the display scale takes over. */}
          <h1 className="text-[clamp(2rem,11vw,2.75rem)] leading-[0.94] tracking-[-0.01em] sm:text-display-md sm:leading-[0.90] sm:tracking-[-0.015em]">
            {chooser.h1}
          </h1>
          {/* Client brand asset, verbatim — never edit this line's wording. */}
          <p className="mt-4 font-display text-xl uppercase text-accent sm:text-2xl">
            {business.tagline}
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/70">
            Locally owned in {business.city}, {business.state}, serving {site.geo.region}.
            Pick what you need, or just call — you will get {business.ownerFirstName}, the
            person who actually shows up.
          </p>

          {/* Above the chooser on purpose: nobody should have to pick a division to call. */}
          <div className="mt-6 grid gap-3 sm:max-w-lg sm:grid-cols-2">
            <TelLink className="btn-accent px-6 py-4 text-xl">
              <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              {business.phoneDisplay}
            </TelLink>
            <SmsLink className="btn-outline px-6 py-4 text-xl">
              <MessageSquare className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              Text us
            </SmsLink>
          </div>
        </div>

        {/* The brand mark as a supporting element — the headline leads, this seconds it.
            Decorative; the header logo already announces the brand. md+ only. */}
        <img
          src="/photos/logo-just-junk-it.webp"
          alt=""
          width={816}
          height={512}
          className="hidden h-28 w-auto md:block lg:h-32"
        />
      </section>

      <section aria-labelledby="divisions-heading" className="border-t-2 border-paper/10">
        <h2 id="divisions-heading" className="sr-only">
          Choose a service
        </h2>
        <ul className="grid gap-px bg-paper/10 md:grid-cols-2">
          {divisions.map((d, i) => {
            const Icon = ICONS[d.key as keyof typeof ICONS];
            return (
              <li key={d.key} className="bg-ink">
                {/*
                  TWO LAYOUTS, ONE MARKUP:
                  - MOBILE (<md): the photo is a top BAND and the text sits below it on
                    solid ink. No scrim needed, the photo reads at full strength, and the
                    text gets the token contrast (paper on ink 18:1). Panel height is
                    content-driven — no vh minimum, no dead space.
                  - DESKTOP (md+): the photo covers the panel and the text sits on a
                    bottom gradient SCRIM — ink 95% at the base, 50% at 40% height, clear
                    by 75% (values verified in the measured-contrast pass). The scrim div
                    is hidden on mobile where nothing sits over the image.
                */}
                <Link
                  href={d.href}
                  className="group relative flex flex-col overflow-hidden md:min-h-[62vh] md:justify-end"
                >
                  {d.photoKey ? (
                    <div className="relative h-48 w-full overflow-hidden sm:h-64 md:absolute md:inset-0 md:h-auto">
                      {/* Full-strength image; hover feedback is a gentle scale, not a
                          brightness flash. Transform-only -> composited, zero CLS. */}
                      <Photo
                        photoKey={d.photoKey}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 hidden md:block md:bg-gradient-to-t md:from-ink/95 md:via-ink/50 md:via-40% md:to-ink/0 md:to-75%"
                      />
                    </div>
                  ) : null}

                  <ScrollReveal delay={i * 80} className="relative p-7 sm:p-10">
                    <Icon className="h-9 w-9 text-accent" strokeWidth={1.75} aria-hidden="true" />
                    <p className="mt-3 font-display text-sm uppercase tracking-[0.25em] text-paper/85">
                      {d.available}
                    </p>
                    <h3 className="mt-2 text-display-sm sm:text-display-md">{d.title}</h3>
                    <p className="mt-3 max-w-sm text-lg leading-relaxed text-paper/85">
                      {d.tagline}
                    </p>
                    {/* Paper text, accent arrow: red type over the scrim measured 2.8:1
                        and failed the 3:1 large-text bar — the arrow keeps the accent. */}
                    <span className="mt-5 inline-flex items-center gap-2 font-display text-xl uppercase tracking-wide text-paper">
                      {d.title}
                      <ArrowRight
                        className="h-5 w-5 text-accent transition-transform duration-200 ease-out group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </ScrollReveal>
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
