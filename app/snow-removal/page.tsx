import { Phone, MessageSquare, Clock, MapPin } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import TelLink, { SmsLink } from "@/components/TelLink";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";

export const metadata = pageMetadata("snowHome");

/**
 * ⚠ SNOW REMOVAL — DELIBERATELY THIN. DO NOT "FINISH" THIS BY GUESSING.
 *
 * Nothing about the snow side has been confirmed by Trystan. We do not know whether he
 * plows, shovels, does roofs or salts; whether he takes seasonal contracts or one-offs;
 * whether the snow service area matches the junk one; or what equipment he runs. There is
 * also no snow photography — every supplied photo was shot between May and July.
 *
 * So this page states ONLY facts confirmed for the business as a whole: who he is, the
 * phone number, the hours, the towns. There is no service list, no equipment claim, no
 * turnaround promise and no pricing. `site.snow.services` is empty and the list below does
 * not render until it is filled.
 *
 * That is why the page leans on type and the CTA rather than a features grid — it is built
 * to look intentional while thin, and to absorb real copy without a redesign.
 *
 * What is needed from Trystan is itemised in HANDOFF.md → SNOW REMOVAL.
 */
export default function SnowRemovalPage() {
  const { business, geo, snow, seo } = site;

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

      {/* Renders nothing until Trystan confirms what the snow service actually includes. */}
      {snow.services.length > 0 ? (
        <section className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-display-sm sm:text-display-md">What we do</h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {snow.services.map((s) => (
                <li key={s.title} className="border-l-4 border-accent pl-5">
                  <h3 className="text-2xl text-paper">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-paper/65">{s.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-t-2 border-paper/10 bg-surface px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">Where we work</h2>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {geo.cities.map((c) => (
              <li key={c} className="font-display text-xl uppercase text-paper/80">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-20">
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
