import type { Faq as FaqItem } from "@/site.config";

/**
 * FAQ list. Native <details>, so every answer is present in the initial HTML whether or
 * not it is expanded — crawlers and screen readers get the full text, and it works with
 * JavaScript disabled.
 *
 * Whatever array is passed here is also what must be passed to faqSchema(), so the markup
 * can never assert a Q&A the page does not display.
 */
export default function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="mt-10 divide-y-2 divide-paper/10 border-y-2 border-paper/10">
      {items.map((f) => (
        <details key={f.id} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-xl uppercase text-paper [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden="true"
              className="shrink-0 font-display text-3xl leading-none text-accent transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-6 pr-8 text-lg leading-relaxed text-paper/70">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
