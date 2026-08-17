import { site } from "@/site.config";

/**
 * BUILD-TIME GO-LIVE GUARD.
 *
 * This module is imported by app/layout.tsx. The root layout is evaluated for every
 * route during `next build` static generation, so this code ALWAYS runs and can never
 * be tree-shaken away. Throwing here fails the build.
 *
 * The rule:
 *
 *   businessSlug empty  +  NEXT_PUBLIC_DEMO_MODE !== 'true'   ->  BUILD FAILS
 *   businessSlug empty  +  NEXT_PUBLIC_DEMO_MODE === 'true'   ->  demo build, no POST
 *   businessSlug set                                          ->  live build, POSTs
 *
 * Why it exists: the CRM endpoint returns HTTP 200 even when businessSlug matches no
 * Business row. A misconfigured live site would therefore show every visitor a green
 * "got it, thanks" while silently dropping every lead, and nothing on the page or in
 * the network tab would look wrong. The only safe place to catch that is the build.
 *
 * There is a second, earlier layer in scripts/preflight.mjs, which fails before Next
 * even starts and prints the same instructions. This module is the authoritative one
 * because it reads the parsed config value rather than the file text.
 */

const slug = site.crm.businessSlug.trim();

/** True when this build is the demo shown to the owner: real UI, no network write. */
export const isDemoMode = slug.length === 0;

if (slug.length === 0 && process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
  throw new Error(
    [
      "",
      "════════════════════════════════════════════════════════════════════",
      "  BUILD BLOCKED — Just Junk It is still in demo configuration.",
      "════════════════════════════════════════════════════════════════════",
      "",
      "  site.config.ts  ->  crm.businessSlug  is an empty string.",
      "",
      "  In this state the quote form does not POST anywhere. Shipping it to a",
      "  real domain would show visitors a success message while every lead is",
      "  silently discarded.",
      "",
      "  Pick one:",
      "",
      "  GOING LIVE  (do all three, in order)",
      "    1. Create the Business row for Just Junk It in Neon.",
      "    2. Paste its verbatim slug into site.config.ts -> crm.businessSlug.",
      "       Copy it from the live row. Do not retype it from memory — a wrong",
      "       slug fails silently and looks identical to a working one.",
      "    3. Delete the NEXT_PUBLIC_DEMO_MODE environment variable from the",
      "       deployment, then redeploy WITHOUT build cache.",
      "",
      "  STAYING A DEMO",
      "    Set  NEXT_PUBLIC_DEMO_MODE=true  in this environment.",
      "    Preview deployments only. Never set it on a custom domain.",
      "",
      "════════════════════════════════════════════════════════════════════",
      "",
    ].join("\n"),
  );
}
