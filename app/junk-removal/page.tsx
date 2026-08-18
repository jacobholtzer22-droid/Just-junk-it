import { Phone, MessageSquare, Check } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import TelLink, { SmsLink } from "@/components/TelLink";
import ContactForm from "@/components/ContactForm";
import Photo from "@/components/Photo";
import BeforeAfter from "@/components/BeforeAfter";
import ServicesGrid from "@/components/ServicesGrid";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import { faqSchema, breadcrumbSchema, serviceSchema } from "@/lib/schema";

export const metadata = pageMetadata("junkHome");

/**
 * The junk removal division home page, and the Google Ads landing destination.
 *
 * `/` is a two-way chooser between the junk and snow divisions, so the junk keywords live
 * here rather than on `/` — that stops the two pages competing for the same query.
 *
 * All ten sections from the brief, in order.
 */
export default function JunkRemovalPage() {
  const { business, hero, trust, whyUs, howItWorks, contact, gallery, geo, serviceArea, faqs, seo, reviews } = site;

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

      {/* ---- What we haul (all eight services) -------------------------------- */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">What we haul</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/70">
            One item or a whole property. If it fits in the trailer and it is legal to haul,
            it goes.
          </p>
          <ServicesGrid />
        </div>
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
          <a
            href="/gallery"
            className="btn-outline mt-8 px-6 py-4 text-lg"
          >
            See the full gallery
          </a>
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

      {/* ---- Reviews -----------------------------------------------------------
          Renders nothing while site.reviews is empty. No Review or AggregateRating schema
          is emitted here or anywhere — self-serving review markup is a penalty risk. */}
      {reviews.length > 0 ? (
        <section className="border-t-2 border-paper/10 px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-display-sm sm:text-display-md">What customers say</h2>
            <div className="mt-10">
              <ReviewsCarousel reviews={reviews} />
            </div>
            <a href="/reviews" className="btn-outline mt-8 px-6 py-4 text-lg">
              Read all reviews
            </a>
          </div>
        </section>
      ) : null}

      {/* ---- FAQ ---------------------------------------------------------------
          The array passed to <Faq> is the SAME array passed to faqSchema() below, so the
          structured data can never claim a question the page does not render. */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-display-sm sm:text-display-md">Common questions</h2>
          <Faq items={faqs} />
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

      <CtaBand />

      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={serviceSchema({
          name: "Junk Removal",
          description: seo.pages.junkHome.description,
          path: "/junk-removal",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Junk Removal", path: "/junk-removal" },
        ])}
      />
    </main>
  );
}
