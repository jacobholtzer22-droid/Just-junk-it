import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { site } from "@/site.config";
import TelLink from "./TelLink";

/**
 * Site header with a real mobile menu — not a desktop nav that wraps.
 *
 * The menu is a native <details>/<summary> disclosure. That is deliberate: it opens and
 * closes with zero JavaScript, so it still works on a slow connection before hydration and
 * on a page that fails to hydrate at all. It is also keyboard operable and announced
 * correctly by screen readers for free, which a div-and-onClick menu is not.
 *
 * The summary is a 56px target, well clear of the 44px minimum.
 */
export default function Header() {
  const { business, nav } = site;
  return (
    <header className="border-b-2 border-paper/10 bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <Link href="/" className="-my-2 flex min-h-[44px] items-center py-2 font-display text-2xl uppercase leading-none tracking-tight text-paper sm:text-3xl">
          Just Junk It
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-7">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex min-h-[44px] items-center font-display text-lg uppercase tracking-wide text-paper/75 hover:text-paper">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <TelLink className="btn-accent px-5 py-3 text-lg">
                <Phone className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {business.phoneDisplay}
              </TelLink>
            </li>
          </ul>
        </nav>

        {/* Mobile menu — no JS required */}
        <details className="group relative md:hidden">
          <summary className="flex h-14 w-14 cursor-pointer list-none items-center justify-center border-2 border-paper/25 text-paper [&::-webkit-details-marker]:hidden">
            <Menu className="h-7 w-7" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 z-50 mt-2 w-64 border-2 border-paper/20 bg-surface p-2 shadow-2xl"
          >
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="block px-4 py-4 font-display text-xl uppercase tracking-wide text-paper hover:bg-paper/10"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
