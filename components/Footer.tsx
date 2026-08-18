import Link from "next/link";
import { Phone, MessageSquare, Mail, Clock, MapPin } from "lucide-react";
import { site } from "@/site.config";
import TelLink, { SmsLink } from "./TelLink";

/**
 * Footer. Carries the NAP (name, area, phone) that the LocalBusiness schema asserts —
 * schema must never claim something the page does not show, and this is where it is shown.
 * The hours here are what makes emitting openingHoursSpecification legitimate.
 */
export default function Footer() {
  const { business, geo, services, footer, nav } = site;
  return (
    <footer className="border-t-2 border-paper/10 bg-surface px-5 py-14 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl uppercase text-paper">{business.name}</p>
          <p className="mt-3 leading-relaxed text-paper/65">{footer.tagline}</p>
          <p className="mt-4 font-display text-lg uppercase text-paper">{business.tagline}</p>
        </div>

        <div>
          <h2 className="font-display text-lg uppercase tracking-widest text-paper/60">Contact</h2>
          <ul className="mt-2">
            <li>
              <TelLink className="-mx-2 flex min-h-[44px] items-center gap-2 px-2 text-lg text-paper hover:text-paper">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {business.phoneDisplay}
              </TelLink>
            </li>
            <li>
              <SmsLink className="-mx-2 flex min-h-[44px] items-center gap-2 px-2 text-lg text-paper hover:text-paper">
                <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
                Text us
              </SmsLink>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="-mx-2 flex min-h-[44px] items-center gap-2 break-all px-2 text-paper/75 hover:text-paper">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {business.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-paper/75">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              {business.hours.display}
            </li>
            <li className="flex items-start gap-2 text-paper/75">
              <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
              {business.city}, {business.state} — serving {geo.region}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg uppercase tracking-widest text-paper/60">Services</h2>
          <ul className="mt-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="-mx-2 flex min-h-[44px] items-center px-2 text-paper/75 hover:text-paper">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg uppercase tracking-widest text-paper/60">More</h2>
          <ul className="mt-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="-mx-2 flex min-h-[44px] items-center px-2 text-paper/75 hover:text-paper">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="-mx-2 flex min-h-[44px] items-center px-2 text-paper/75 hover:text-paper">
                Privacy
              </Link>
            </li>
          </ul>
          {/* Only real profiles render — empty config entries are skipped entirely. */}
          <ul className="mt-3 flex gap-5">
            {business.social.facebook ? (
              <li>
                <a href={business.social.facebook} className="-mx-2 flex min-h-[44px] items-center px-2 text-paper/75 hover:text-paper">Facebook</a>
              </li>
            ) : null}
            {business.social.instagram ? (
              <li>
                <a href={business.social.instagram} className="-mx-2 flex min-h-[44px] items-center px-2 text-paper/75 hover:text-paper">Instagram</a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t-2 border-paper/10 pt-6 text-sm text-paper/60">
        <p>
          © {new Date().getFullYear()} {business.name} · {business.city}, {business.state} ·{" "}
          <TelLink className="inline-flex min-h-[44px] items-center hover:text-paper">{business.phoneDisplay}</TelLink>
        </p>
        <p className="mt-2">
          <a href={footer.builtByHref} className="inline-flex min-h-[44px] items-center hover:text-paper">{footer.builtBy}</a>
        </p>
      </div>
    </footer>
  );
}
