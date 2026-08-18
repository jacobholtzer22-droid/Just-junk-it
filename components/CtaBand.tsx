import { Phone, MessageSquare } from "lucide-react";
import { site } from "@/site.config";
import TelLink, { SmsLink } from "./TelLink";

/** Closing conversion band. Full-bleed accent so it reads as the end of the page. */
export default function CtaBand() {
  const { cta, business } = site;
  return (
    <section className="bg-accent px-5 py-14 text-paper sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-display-sm sm:text-display-md">{cta.bandHeading}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/90">{cta.bandBody}</p>
        <div className="mt-8 grid gap-3 sm:max-w-lg sm:grid-cols-2">
          <TelLink className="inline-flex min-h-[56px] items-center justify-center gap-2.5 bg-ink px-6 py-4 font-display text-xl uppercase tracking-wide text-paper">
            <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            {business.phoneDisplay}
          </TelLink>
          <SmsLink className="inline-flex min-h-[56px] items-center justify-center gap-2.5 border-2 border-paper px-6 py-4 font-display text-xl uppercase tracking-wide text-paper">
            <MessageSquare className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            Text us
          </SmsLink>
        </div>
      </div>
    </section>
  );
}
