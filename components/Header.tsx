import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { site } from "@/site.config";
import TelLink from "./TelLink";

/**
 * Site header with a real mobile menu — not a desktop nav that wraps.
 *
 * SIZING (Aug 2026 refinement): fixed bar heights — h-16 (64px) mobile, h-[76px]
 * desktop — with everything vertically centered against them. The logo is the only
 * brand mark: the lockup contains the wordmark, so there is no "Just Junk It" text
 * beside it (the home link's accessible name is its aria-label). Nav items and the
 * phone button are text-base with `whitespace-nowrap`, sized so every item holds one
 * line at 1280px with comfortable gaps — wrapping is impossible, not just unlikely.
 *
 * The menu is a native <details>/<summary> disclosure. That is deliberate: it opens and
 * closes with zero JavaScript, so it still works on a slow connection before hydration and
 * on a page that fails to hydrate at all. It is also keyboard operable and announced
 * correctly by screen readers for free, which a div-and-onClick menu is not.
 */
export default function Header() {
  const { business, nav } = site;
  return (
    <header className="border-b-2 border-paper/10 bg-ink">
      {/* Explicit px heights: the site's 17px rem base makes h-16 render 68px, so the
          64/76px targets are stated literally. Bar totals include the 2px bottom border. */}
      <div className="mx-auto flex h-[62px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 md:h-[74px]">
        <Link href="/" aria-label="Just Junk It — home" className="flex items-center">
          {/* Decorative (aria-label above carries the name). Real dims -> no layout shift. */}
          <img
            src="/photos/logo-just-junk-it.webp"
            alt=""
            width={816}
            height={512}
            className="h-[44px] w-auto md:h-[52px]"
          />
        </Link>

        {/* Desktop nav — lg+ only: at 768-1023px the full item set + phone button
            cannot hold one line without crowding the logo, so tablets get the same
            disclosure menu as phones. Every item nowrap: one line by construction. */}
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-5 lg:gap-6">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="flex min-h-[44px] items-center whitespace-nowrap font-display text-base uppercase tracking-normal text-paper/75 transition-colors duration-150 hover:text-paper"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <TelLink className="btn-accent whitespace-nowrap px-4 py-2.5 text-base">
                <Phone className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {business.phoneDisplay}
              </TelLink>
            </li>
          </ul>
        </nav>

        {/* Mobile menu — no JS required. 48x48 target (min is 44). */}
        <details className="group relative lg:hidden">
          <summary className="flex h-[48px] w-[48px] cursor-pointer list-none items-center justify-center border-2 border-paper/25 text-paper [&::-webkit-details-marker]:hidden">
            <Menu className="h-6 w-6" aria-hidden="true" />
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
                    className="block px-4 py-4 font-display text-xl uppercase tracking-wide text-paper active:bg-paper/10"
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
