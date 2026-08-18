import { Phone, MessageSquare, Check } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import TelLink, { SmsLink } from "@/components/TelLink";
import ContactForm from "@/components/ContactForm";
import Photo from "@/components/Photo";
import BeforeAfter from "@/components/BeforeAfter";

export const metadata = pageMetadata("home");

/**
 * PARTIAL HOMEPAGE — deliberately not all ten sections yet.
 *
 * Present: hero, trust strip, before/after proof, how it works, why Just Junk It,
 * service area, quote form.
 * Still to come for GATE A: the eight-service "what we haul" grid, the FAQ block with
 * FAQPage schema, and the footer. Those wait on service copy, which is Phase 2 proper.
 */
export default function HomePage() {
  const { business, hero, trust, whyUs, howItWorks, contact, gallery, geo, serviceArea } = site;

  return (
    <main>
      {/* ---- Hero ------------------------------------------------------------ */}
      <section className="border-b-2 border-paper/10">
        <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-6 sm:pt-20">
          <h1 className="text-display-sm sm:text-display-lg lg:text-display-xl">{hero.h1}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70 sm:text-xl">
            {hero.sub}
          </p>
          <p className="mt-6 font-display text-2xl uppercase text-accent sm:text-3xl">
            {business.tagline}
          </p>

          {/* Tappable inside the first screen at 390px. */}
          <div className="mt-9 grid gap-3 sm:max-w-lg sm:grid-cols-2">
            <TelLink className="btn-accent px-6 py-4 text-xl">
              <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              {business.phoneDisplay}
            </TelLink>
            <SmsLink className="btn-outline px-6 py-4 text-xl">
              <MessageSquare className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              Text for a quote
            </SmsLink>
          </div>
        </div>

        {/* Full-bleed band, not a card. */}
        <div className="mt-12 max-h-[52vh] overflow-hidden sm:max-h-[60vh]">
          <Photo
            photoKey={hero.photoKey}
            sizes="100vw"
            priority
            className="block w-full object-cover"
          />
        </div>
      </section>

      {/* ---- Trust strip ------------------------------------------------------ */}
      <section className="border-b-2 border-paper/10 bg-surface px-5 py-8 sm:px-6">
        <ul className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {trust.map((t) => (
            <li key={t.label} className="flex gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-accent" strokeWidth={3} aria-hidden="true" />
              <div>
                <p className="font-display text-xl uppercase text-paper">{t.label}</p>
                <p className="mt-1 text-paper/60">{t.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Before / after proof --------------------------------------------- */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">{gallery.heading}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/70">{gallery.body}</p>
          <div className="mt-10 grid gap-8">
            {gallery.pairs.map((p) => (
              <BeforeAfter key={p.beforeKey} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ------------------------------------------------------ */}
      <section className="border-y-2 border-paper/10 bg-surface px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">How it works</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3">
            {howItWorks.map((s) => (
              <li key={s.step}>
                <span className="font-display text-display-md text-accent" aria-hidden="true">
                  {s.step}
                </span>
                <h3 className="mt-2 text-2xl text-paper">{s.heading}</h3>
                <p className="mt-2 leading-relaxed text-paper/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Why Just Junk It --------------------------------------------------
          Renders only when the config array is populated. The five points are verbatim
          from Trystan's own site; nothing here is written by us. */}
      {whyUs.length > 0 ? (
        <section className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-display-sm sm:text-display-md">Why Just Junk It</h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {whyUs.map((w) => (
                <li key={w.heading} className="border-l-4 border-accent pl-5">
                  <h3 className="text-2xl text-paper">{w.heading}</h3>
                  <p className="mt-2 leading-relaxed text-paper/65">{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---- Service area ------------------------------------------------------ */}
      <section className="border-y-2 border-paper/10 bg-surface px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">{serviceArea.heading}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/70">{serviceArea.body}</p>
          {/* Real crawlable text, not an image or a map embed. */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {geo.cities.map((c) => (
              <li key={c} className="font-display text-xl uppercase text-paper/80">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Quote form -------------------------------------------------------- */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-display-sm sm:text-display-md">{contact.heading}</h2>
          <p className="mt-4 text-lg leading-relaxed text-paper/70">{contact.body}</p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
