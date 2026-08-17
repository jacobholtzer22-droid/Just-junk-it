"use client";

import { site } from "@/site.config";
import { fireConversion } from "./Analytics";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Screen-reader label. Defaults to something sensible for a bare number. */
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
      aria-label={ariaLabel ?? `Call Just Junk It at ${site.business.phoneDisplay}`}
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
      aria-label={ariaLabel ?? `Text Just Junk It at ${site.business.phoneDisplay}`}
      onClick={() => fireConversion(site.ads.conversions.text)}
    >
      {children}
    </a>
  );
}
