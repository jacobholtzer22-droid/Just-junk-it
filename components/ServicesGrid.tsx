import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/site.config";

/**
 * The eight services.
 *
 * Not cards-with-rounded-corners-and-a-drop-shadow. Hard-edged panels on a 2px grid, so
 * the block reads as one dense slab rather than eight floating objects. The accent appears
 * only on the arrow, so the eye still knows these are the tappable things.
 *
 * Each panel is a full-height link — the whole rectangle is the target, not just the words.
 */
export default function ServicesGrid() {
  const { services } = site;
  return (
    <ul className="mt-10 grid gap-px border-2 border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => {
        const Icon = s.icon;
        return (
          <li key={s.slug} className="bg-ink">
            <Link
              href={`/${s.slug}`}
              className="group flex h-full min-h-[168px] flex-col justify-between gap-4 p-6 transition-colors hover:bg-surface"
            >
              <Icon className="h-8 w-8 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl uppercase leading-tight text-paper">{s.title}</h3>
                <p className="mt-2 text-paper/60">{s.blurb}</p>
              </div>
              <ArrowRight
                className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
