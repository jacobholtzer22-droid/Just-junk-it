"use client";

import { site } from "@/site.config";
import { fireConversion } from "./Analytics";

type Props = {
  children: React.ReactNode;
  className?: string;
  /**
   * Only for icon-only links. Leave unset when the link has visible text.
   *
   * WCAG 2.5.3 (Label in Name) requires the accessible name to CONTAIN the visible label.
   * These links used to default to "Text Just Junk It at (218) 256-1340" while showing
   * "Text us" — which fails, and worse, breaks voice control: a user saying "click Text
   * us" would not match. Visible text is now the accessible name.
   */
  ariaLabel?: string;
};

/**
 * Every tel: link on the site goes through here, and every sms: link through SmsLink
 * below, so the number is written in exactly one place and the Ads conversion is
 * impossible to forget on a new button.
 *
 * Both are inert until site.ads.tagId is a real AW- id.
 */
export default function TelLink({ children, className, ariaLabel }: Props) {
  return (
    <a
      href={site.business.phoneHref}
      className={className}
      aria-label={ariaLabel}
      onClick={() => fireConversion(site.ads.conversions.call)}
    >
      {children}
    </a>
  );
}

export function SmsLink({ children, className, ariaLabel }: Props) {
  return (
    <a
      href={site.business.smsHref}
      className={className}
      aria-label={ariaLabel}
      onClick={() => fireConversion(site.ads.conversions.text)}
    >
      {children}
    </a>
  );
}
