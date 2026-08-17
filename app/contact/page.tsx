import { Phone, MessageSquare, Clock } from "lucide-react";
import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import TelLink, { SmsLink } from "@/components/TelLink";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  const { business, contact, geo } = site;
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <h1 className="text-display-sm sm:text-display-md">{contact.heading}</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/70">{contact.body}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <TelLink className="btn-accent px-6 py-4 text-xl">
          <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          {business.phoneDisplay}
        </TelLink>
        <SmsLink className="btn-outline px-6 py-4 text-xl">
          <MessageSquare className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          Text us
        </SmsLink>
      </div>

      <p className="mt-5 flex items-center gap-2 text-paper/60">
        <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
        {business.hours.display} · {business.city}, {business.state} and all of {geo.region}
      </p>

      <div className="mt-12">
        <ContactForm />
      </div>
    </main>
  );
}
