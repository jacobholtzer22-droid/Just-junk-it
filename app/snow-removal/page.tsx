import Link from "next/link";
import { Phone, MessageSquare, Clock, MapPin, ArrowRight } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import TelLink, { SmsLink } from "@/components/TelLink";
import ContactForm from "@/components/ContactForm";
import Photo from "@/components/Photo";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import ScrollReveal from "@/components/ScrollReveal";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

export const metadata = pageMetadata("snowHome");

/**
 * SNOW REMOVAL — the winter division home, live for the 2026–27 season.
 *
 * WHAT THIS PAGE MAY CLAIM (all confirmed via Jacob, Aug 2026): snow removal is offered;
 * this is the FIRST season; the service area is the same Itasca County towns as the junk
 * side; quotes are free; phone, hours and owner are the business-wide facts. The page
 * says "first season" plainly — local and new beats pretending.
 *
 * WHAT IT MUST NOT CLAIM, because none of it is confirmed: plow vs shovel vs blow,
 * roofs, salting/sanding, seasonal contracts vs per-visit, trigger depths, response
 * times, commercial capability, equipment. Open questions: HANDOFF.md → CLIENT QUESTIONS.
 *
 * PHOTOS ARE STOCK (Pexels, commercial license, recorded in seo/PHOTO-INVENTORY.md §7):
 * scene shots only — no operators, no plow trucks, no equipment — because every OTHER
 * image on this site is the client's real work and a stock crew photo would read as his.
 * Swap list: HANDOFF.md → SWAP AFTER FIRST SNOW. Stock never enters /gallery.
 */
export default function SnowRemovalPage() {
  const { business, geo, snow, snowFaqs, seo } = site;

  // Same render-what-you-mark discipline as lib/service-page.tsx: the array rendered
  // below IS the array handed to faqSchema.
  const pageFaqs = snow.faqIds.map((id) => snowFaqs.find((f) => f.id === id)!).filter(Boolean);
  const related = snow.related
    .map((r) => site.services.find((x) => x.slug === r)!)
    .filter(Boolean);

  return (
    <main>
      <section className="border-b-2 border-paper/10 px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-paper/70">
            Winter season
          </p>
          <h1 className="mt-4 text-display-sm sm:text-display-lg">{snow.h1}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70 sm:text-xl">
            {snow.sub}
          </p>

          <div className="mt-9 grid gap-3 sm:max-w-lg sm:grid-cols-2">
            <TelLink className="btn-accent px-6 py-4 text-xl">
              <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              {business.phoneDisplay}
            </TelLink>
            <SmsLink className="btn-outline px-6 py-4 text-xl">
              <MessageSquare className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              Text for availability
            </SmsLink>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            <li className="flex gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-display text-xl uppercase text-paper">{business.hours.display}</p>
                <p className="mt-1 text-paper/60">Call or text and you get {business.ownerFirstName}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-display text-xl uppercase text-paper">
                  {business.city}, {business.state}
                </p>
                <p className="mt-1 text-paper/60">Serving {geo.region}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Winter scenes — STOCK (see the header comment), no crew, no rig. Shown as a
          contained side-by-side pair at (near-)native portrait aspect, NOT as full-bleed
          bands: both sources are 2:3-or-taller portraits, and a short wide band clipped
          them to a ~20% slice that read as an unreadable zoomed smudge. aspect-[2/3] is
          exactly native for the driveway shot and a mild trim for the steps shot. */}
      <section className="border-b-2 border-paper/10 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          {[
            "stock-snow-01-driveway-pines",
            "stock-snow-02-entry-steps",
          ].map((key) => (
            <figure key={key} className="border-2 border-paper/10 bg-surface">
              <Photo
                photoKey={key}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="block aspect-[2/3] w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* First-season honesty + how it works. */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <h2 className="text-display-sm sm:text-display-md">{snow.firstSeason.heading}</h2>
            {snow.firstSeason.body.map((p) => (
              <p key={p.slice(0, 24)} className="mt-6 text-lg leading-relaxed text-paper/75">
                {p}
              </p>
            ))}
          </ScrollReveal>
          <ScrollReveal delay={90}>
            <ol className="grid gap-8">
              {snow.howItWorks.map((s) => (
                <li key={s.step} className="flex gap-5">
                  <span className="font-display text-display-sm leading-none text-accent" aria-hidden="true">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-2xl text-paper">{s.heading}</h3>
                    <p className="mt-2 leading-relaxed text-paper/65">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t-2 border-paper/10 bg-surface px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">Where we work</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/70">
            Same ground the junk side covers all year: based in {geo.lead}, working across{" "}
            {geo.region}. Not on the list? Call anyway — if it is close, we will tell you straight.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {geo.cities.map((c) => (
              <li key={c} className="font-display text-xl uppercase text-paper/80">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — the array rendered here is EXACTLY the array in the FAQPage schema below. */}
      <section className="border-t-2 border-paper/10 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-display-sm sm:text-display-md">Snow questions</h2>
          <Faq items={pageFaqs} />
        </div>
      </section>

      {/* Cross-links into the junk division — same pattern as lib/service-page.tsx. */}
      {related.length > 0 ? (
        <section className="px-5 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-display-sm">The rest of the year</h2>
            <ul className="mt-8 grid gap-px border-2 border-paper/10 bg-paper/10 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="bg-ink">
                  <Link
                    href={`/${r.slug}`}
                    className="group flex h-full items-center justify-between gap-4 p-6 transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-surface active:translate-y-0"
                  >
                    <span className="font-display text-xl uppercase text-paper">{r.title}</span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-t-2 border-paper/10 bg-surface px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-display-sm sm:text-display-md">Ask about snow</h2>
          <p className="mt-4 text-lg leading-relaxed text-paper/70">
            Tell us where you are and what needs clearing, and you will get a call back.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      <CtaBand />

      <JsonLd data={faqSchema(pageFaqs)} />
      <JsonLd
        data={serviceSchema({
          name: "Snow Removal",
          description: seo.pages.snowHome.description,
          path: "/snow-removal",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Snow Removal", path: "/snow-removal" },
        ])}
      />
    </main>
  );
}
