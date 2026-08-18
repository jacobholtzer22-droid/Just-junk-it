import { Phone, MessageSquare } from "lucide-react";
import { site } from "@/site.config";
import TelLink, { SmsLink } from "./TelLink";

/**
 * Sticky bottom bar. Present on every page, phone only.
 *
 * This is the single biggest conversion path on the site — most paid junk-removal
 * clicks are phones, and the fastest thing a person with a pile of junk can do is tap
 * a button. Both halves are full-height 56px+ targets separated by a hard divider so a
 * thumb cannot land between them and hit nothing.
 *
 * Body carries .page-shell padding-bottom so this never covers the last element.
 */
export default function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t-2 border-ink md:hidden">
      <TelLink className="flex min-h-[68px] items-center justify-center gap-2.5 bg-accent font-display text-xl uppercase tracking-wide text-paper">
        <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        {site.cta.callLabel}
      </TelLink>
      <SmsLink className="flex min-h-[68px] items-center justify-center gap-2.5 border-l-2 border-ink bg-paper font-display text-xl uppercase tracking-wide text-ink">
        <MessageSquare className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        {site.cta.textLabel}
      </SmsLink>
    </div>
  );
}
