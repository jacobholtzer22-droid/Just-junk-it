import { MapPin, Clock } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import ScrollReveal from "@/components/ScrollReveal";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata("serviceAreas");

/** Towns are crawlable text, never a map embed or an image of a list. */
export default function ServiceAreasPage() {
  const { geo, business, serviceArea } = site;
  return (
    <main>
      <section className="border-b-2 border-paper/10 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h1 className="text-display-sm sm:text-display-lg">{serviceArea.heading}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">{serviceArea.body}</p>
          </ScrollReveal>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:max-w-2xl">
            <li className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-paper/75">Based in {business.city}, {business.state} {business.zip}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-paper/75">{business.hours.display}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">Towns we cover</h2>
          <ul className="mt-10 grid gap-px border-2 border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
            {geo.cities.map((c, i) => (
              <li key={c} className="bg-ink">
                <ScrollReveal delay={Math.min(i * 30, 180)}>
                  <p className="flex min-h-[76px] items-center gap-3 px-6 font-display text-xl uppercase text-paper">
                    <MapPin className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    {c}
                  </p>
                </ScrollReveal>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70">
            Not on the list? Call or text anyway. If you are close to {geo.region} we will
            tell you straight whether we can get to you.
          </p>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas" }])} />
    </main>
  );
}
