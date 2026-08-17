import { Phone, MessageSquare } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import TelLink, { SmsLink } from "@/components/TelLink";
import ContactForm from "@/components/ContactForm";

export const metadata = pageMetadata("home");

/**
 * PARTIAL — hero, trust strip, how-it-works and the quote form only.
 *
 * The remaining homepage sections are blocked at the Phase 0 gate and are deliberately
 * absent rather than filled with invented copy:
 *   - "What we haul" (8 service links)  -> waiting on service copy sign-off
 *   - Before/after proof                -> waiting on pair approval (seo/PHOTO-INVENTORY.md)
 *   - "Why Just Junk It"                -> BLOCKED: the five points from his current
 *                                          site were never supplied. site.whyUs is []
 *                                          and this section does not render.
 *   - Service area, FAQ, footer         -> queued behind the above
 */
export default function HomePage() {
  const { business, hero, trust, howItWorks, contact } = site;

  return (
    <main>
      <section className="border-b-2 border-paper/10 px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-display-sm sm:text-display-lg lg:text-display-xl">{hero.h1}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/70 sm:text-xl">
            {hero.sub}
          </p>
          <p className="mt-6 font-display text-2xl uppercase text-accent sm:text-3xl">
            {business.tagline}
          </p>

          {/* Phone is tappable within the first screen on a 390px viewport. */}
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
      </section>

      <section className="border-b-2 border-paper/10 bg-surface px-5 py-8 sm:px-6">
        <ul className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {trust.map((t) => (
            <li key={t.label}>
              <p className="font-display text-xl uppercase text-paper">{t.label}</p>
              <p className="mt-1 text-paper/60">{t.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-display-sm sm:text-display-md">How it works</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3">
            {howItWorks.map((s) => (
              <li key={s.step}>
                <span
                  className="font-display text-display-md text-accent"
                  aria-hidden="true"
                >
                  {s.step}
                </span>
                <h3 className="mt-2 text-2xl text-paper">{s.heading}</h3>
                <p className="mt-2 leading-relaxed text-paper/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t-2 border-paper/10 bg-surface px-5 py-16 sm:px-6 sm:py-20">
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
