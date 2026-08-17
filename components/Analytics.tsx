"use client";

import Script from "next/script";
import { site } from "@/site.config";

/**
 * Google Ads tag scaffold.
 *
 * Renders NOTHING until site.ads.tagId is a real AW- id. A blank id is deliberately
 * inert so a half-wired tag can never fire junk conversions into a live account.
 *
 * Unlike the CRM slug, a blank ads id does NOT fail the build — ads legitimately come
 * after the site is up, and blocking the build on them would be wrong.
 *
 * IMPORTANT: config values bake in at BUILD time. After filling in the real ids, the
 * site must be redeployed WITHOUT build cache or the blanks stay in the bundle.
 *
 * Three website conversions are wired:
 *   - contact  fired on quote-form success   (ContactForm)
 *   - call     fired on any tel: link tap    (TelLink)
 *   - text     fired on any sms: link tap    (SmsLink)
 * Any call-asset conversion lives in the Ads account, not on the site.
 */
export const adsEnabled = /^AW-/.test(site.ads.tagId);

export default function Analytics() {
  if (!adsEnabled) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${site.ads.tagId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.ads.tagId}');`}
      </Script>
    </>
  );
}

/** Fire a Google Ads conversion. No-ops safely while the tag or label is blank. */
export function fireConversion(label: string) {
  if (!adsEnabled) return;
  if (!label) return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("event", "conversion", {
    send_to: `${site.ads.tagId}/${label}`,
  });
}
