import { MessageSquarePlus } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import Stars from "@/components/Stars";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata("reviews");

/**
 * ⚠ NO Review OR AggregateRating SCHEMA ON THIS PAGE, and none is coming.
 *
 * Self-serving review markup on your own domain is against Google's structured data
 * guidelines and is a penalty risk — it is one of the few things that can actively hurt a
 * site rather than simply do nothing. The reviews are rendered as plain readable text for
 * humans. Star markup belongs on the Google Business Profile, which Google already trusts.
 *
 * While site.reviews is empty this page still exists and still resolves — it explains that
 * reviews are on Facebook and points there, rather than showing an empty shell.
 */
export default function ReviewsPage() {
  const { reviews, business } = site;
  const hasReviews = reviews.length > 0;

  return (
    <main>
      <section className="border-b-2 border-paper/10 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h1 className="text-display-sm sm:text-display-lg">What customers say</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
              {hasReviews
                ? "Every review below is reproduced word for word from where it was left. Nothing has been shortened or tidied up."
                : `Reviews for ${business.name} live on Facebook. Head there to read them, or leave one if we have done work for you.`}
            </p>
          </ScrollReveal>

          {!hasReviews && business.social.facebook ? (
            <ScrollReveal delay={80}>
              <a
                href={business.social.facebook}
                className="btn-accent mt-8 px-7 py-4 text-lg"
              >
                <MessageSquarePlus className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                Read reviews on Facebook
              </a>
            </ScrollReveal>
          ) : null}
        </div>
      </section>

      {hasReviews ? (
        <section className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <ReviewsCarousel reviews={reviews} />
            </ScrollReveal>

            {/* Full unpaginated list under the carousel: a carousel is a browsing aid, not
                the only way to reach the content. Everything is on the page regardless. */}
            <h2 className="mt-16 text-display-sm sm:text-display-md">All reviews</h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {reviews.map((r, i) => (
                <li key={`${r.author}-${i}`}>
                  <ScrollReveal delay={(i % 2) * 70}>
                    <figure className="h-full border-2 border-paper/15 bg-surface p-6">
                      {r.rating ? <Stars rating={r.rating} /> : null}
                      <blockquote className="mt-4 whitespace-pre-line text-lg leading-relaxed text-paper/85">
                        {r.body}
                      </blockquote>
                      <figcaption className="mt-5 border-t-2 border-paper/10 pt-4">
                        <span className="font-display text-xl uppercase text-paper">{r.author}</span>
                        <span className="mt-1 block text-sm uppercase tracking-widest text-paper/50">
                          via {r.source}
                        </span>
                      </figcaption>
                    </figure>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaBand />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ])}
      />
    </main>
  );
}
