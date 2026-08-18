import { site } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata("privacy");

/**
 * Describes only what this site actually does. The quote form posts name, phone, email and
 * message to the Align and Acquire CRM; the SMS consent checkbox is what permits a text
 * reply. There is no analytics, no pixel and no advertising tag live at the moment — when
 * the Google Ads tag is added, the third-party paragraph below must be revisited.
 */
export default function PrivacyPage() {
  const { business } = site;
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <h1 className="text-display-sm sm:text-display-md">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-paper/75">
        <p>
          This page explains what {business.name} does with information you send through
          this website.
        </p>
        <h2 className="pt-4 text-2xl text-paper">What we collect</h2>
        <p>
          If you fill in the quote form we collect the name, phone number, email address,
          location and description you type into it. That is all. We do not ask for payment
          details anywhere on this site.
        </p>
        <h2 className="pt-4 text-2xl text-paper">What we do with it</h2>
        <p>
          It is used to contact you about the job you asked about, and for nothing else. We
          do not sell it, rent it or share it with anyone outside the business.
        </p>
        <h2 className="pt-4 text-2xl text-paper">Text messages</h2>
        <p>
          The consent box on the quote form is what permits us to reply by text. It is never
          ticked for you. If you tick it and later change your mind, reply STOP to any
          message and the texts stop. Message and data rates may apply.
        </p>
        <h2 className="pt-4 text-2xl text-paper">Third parties</h2>
        <p>
          Form submissions are handled by Align and Acquire, which builds and runs this site
          and its customer records. The site is hosted by Vercel, which keeps standard server
          logs. There is no advertising or analytics tracking running on this site at present.
        </p>
        <h2 className="pt-4 text-2xl text-paper">Getting your information removed</h2>
        <p>
          Call or text {business.phoneDisplay}, or email{" "}
          <a className="-my-2 inline-flex min-h-[44px] items-center py-2 text-accent underline underline-offset-2" href={`mailto:${business.email}`}>
            {business.email}
          </a>
          , and ask. We will delete it.
        </p>
      </div>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }])} />
    </main>
  );
}
