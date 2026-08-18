import Link from "next/link";
import { Check, Phone, MessageSquare, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { site, type Service } from "@/site.config";
import TelLink, { SmsLink } from "@/components/TelLink";
import ContactForm from "@/components/ContactForm";
import Photo from "@/components/Photo";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Stars from "@/components/Stars";
import ScrollReveal from "@/components/ScrollReveal";
import JsonLd from "@/components/JsonLd";
import { faqSchema, breadcrumbSchema, serviceSchema } from "@/lib/schema";

export function getService(slug: string): Service {
  const s = site.services.find((x) => x.slug === slug);
  if (!s) throw new Error(`No service with slug "${slug}" in site.config.ts`);
  return s;
}

export function serviceMetadata(slug: string): Metadata {
  const s = getService(slug);
  const path = `/${s.slug}`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url: path,
      siteName: site.seo.siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: s.metaTitle, description: s.metaDescription },
  };
}

/**
 * Shared service page.
 *
 * BUILT TO STAND ALONE AS AN AD LANDING PAGE. It never assumes the visitor saw the
 * homepage: the H1 answers the query, the phone and text buttons are inside the first
 * screen at 390px, and there is a quote form on the page without hunting.
 *
 * PAGES WITH NO JOB PHOTO: three services have no photograph of that work (garage,
 * construction debris, hot tub/shed). They fall back to the truck, whose alt text
 * describes exactly what is in the frame and never implies the page's service happened
 * there. The layout is built so the photo band is a bonus rather than load-bearing — a
 * page without one still reads as finished, which is why the "what we take" list is the
 * visual anchor rather than an image.
 */
export default function ServicePage({ slug }: { slug: string }) {
  const s = getService(slug);
  const { business, geo, faqs, reviews } = site;

  // The FAQ array rendered here is the exact array passed to faqSchema below.
  const pageFaqs = (s.faqIds ?? []).map((id) => faqs.find((f) => f.id === id)!).filter(Boolean);
  const review = reviews.find((r) => r.services?.includes(slug));
  const related = (s.related ?? []).map((r) => site.services.find((x) => x.slug === r)!).filter(Boolean);

  return (
    <main>
      <section className="border-b-2 border-paper/10 px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm uppercase tracking-widest text-paper/60">
            <Link href="/junk-removal" className="-my-2 inline-flex min-h-[44px] items-center py-2 hover:text-accent">Junk Removal</Link>
            <span aria-hidden="true"> / </span>
            <span className="text-paper/70">{s.title}</span>
          </nav>

          <ScrollReveal>
            <h1 className="text-display-sm sm:text-display-lg">
              {s.title} in {geo.lead}, MN
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75 sm:text-xl">{s.intro}</p>
          </ScrollReveal>

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

      <section className="px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <h2 className="text-display-sm">What we take</h2>
            <ul className="mt-8 grid gap-3">
              {(s.covers ?? []).map((c) => (
                <li key={c} className="flex gap-3 text-lg text-paper/80">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-accent" strokeWidth={3} aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={90}>
            <h2 className="text-display-sm">When people call</h2>
            <ul className="mt-8 grid gap-5">
              {(s.whenYouNeedIt ?? []).map((w) => (
                <li key={w} className="border-l-4 border-accent pl-5 text-lg leading-relaxed text-paper/75">
                  {w}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {s.photoKey ? (
        <section className="border-y-2 border-paper/10">
          <div className="max-h-[56vh] overflow-hidden">
            <Photo photoKey={s.photoKey} sizes="100vw" className="block w-full object-cover" />
          </div>
        </section>
      ) : null}

      {review ? (
        <section className="px-5 py-14 sm:px-6 sm:py-16">
          <ScrollReveal className="mx-auto max-w-3xl">
            <figure className="border-2 border-paper/15 bg-surface p-7 sm:p-9">
              {review.rating ? <Stars rating={review.rating} /> : null}
              <blockquote className="mt-4 whitespace-pre-line text-xl leading-relaxed text-paper/85">
                {review.body}
              </blockquote>
              <figcaption className="mt-5 border-t-2 border-paper/10 pt-4">
                <span className="font-display text-xl uppercase text-paper">{review.author}</span>
                <span className="mt-1 block text-sm uppercase tracking-widest text-paper/60">
                  via {review.source}
                </span>
              </figcaption>
            </figure>
          </ScrollReveal>
        </section>
      ) : null}

      {pageFaqs.length > 0 ? (
        <section className="border-t-2 border-paper/10 px-5 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-display-sm sm:text-display-md">Questions</h2>
            <Faq items={pageFaqs} />
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="px-5 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-display-sm">Also handled</h2>
            <ul className="mt-8 grid gap-px border-2 border-paper/10 bg-paper/10 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="bg-ink">
                  <Link href={`/${r.slug}`} className="group flex h-full items-center justify-between gap-4 p-6 transition-colors hover:bg-surface">
                    <span className="font-display text-xl uppercase text-paper">{r.title}</span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-t-2 border-paper/10 bg-surface px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-display-sm sm:text-display-md">Get a free quote</h2>
          <p className="mt-4 text-lg leading-relaxed text-paper/70">
            Tell us what you have and where it is. You will get a straight answer.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      <CtaBand />

      {pageFaqs.length > 0 ? <JsonLd data={faqSchema(pageFaqs)} /> : null}
      <JsonLd
        data={serviceSchema({
          name: s.title,
          description: s.metaDescription ?? "",
          path: `/${s.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Junk Removal", path: "/junk-removal" },
          { name: s.title, path: `/${s.slug}` },
        ])}
      />
    </main>
  );
}
