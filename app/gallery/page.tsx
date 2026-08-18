import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import BeforeAfter from "@/components/BeforeAfter";
import Photo from "@/components/Photo";
import ScrollReveal from "@/components/ScrollReveal";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { photoByKey } from "@/lib/photo-manifest";

export const metadata = pageMetadata("gallery2");

/**
 * Every image here is one of Trystan's real jobs. No stock, no staging.
 *
 * The two carport frames appear in `singles` and are deliberately NOT adjacent — they were
 * rejected as a before/after pair (camera moves inside to outside, seven days apart) and
 * placing them side by side would re-imply the pairing the gate threw out.
 */
export default function GalleryPage() {
  const { gallery } = site;
  return (
    <main>
      <section className="border-b-2 border-paper/10 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h1 className="text-display-sm sm:text-display-lg">{gallery.heading}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">{gallery.body}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10">
          {gallery.pairs.map((p, i) => (
            <ScrollReveal key={p.beforeKey} delay={i === 0 ? 0 : 60}>
              <BeforeAfter {...p} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="border-t-2 border-paper/10 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display-sm sm:text-display-md">On the job</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {gallery.singles.map((key, i) => {
              const p = photoByKey[key];
              if (!p) return null;
              return (
                <li key={key}>
                  <ScrollReveal delay={(i % 2) * 70}>
                    <figure className="border-2 border-paper/10">
                      <Photo photoKey={key} sizes="(min-width: 640px) 50vw, 100vw" className="block w-full object-cover" />
                      <figcaption className="border-t-2 border-paper/10 bg-surface px-4 py-4 text-paper/70">
                        {p.alt}
                      </figcaption>
                    </figure>
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} />
    </main>
  );
}
