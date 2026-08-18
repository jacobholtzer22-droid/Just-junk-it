import { site } from "@/site.config";

/**
 * BUILD-TIME GO-LIVE GUARD — domain-aware version.
 *
 * This module is imported by app/layout.tsx. The root layout is evaluated for every
 * route during `next build` static generation, so this code ALWAYS runs and can never
 * be tree-shaken away. Throwing here fails the build.
 *
 * WHY IT CHANGED (Aug 2026): demo mode moved to the Production environment so the owner
 * gets a clean, stable vercel.app link. That removed the old guard's protection at the
 * exact moment it mattered most — the day a custom domain gets pointed at the project.
 * So the guard is now keyed on the DOMAIN, not on the environment name:
 *
 *   HOST                          SLUG     DEMO FLAG   RESULT
 *   ─────────────────────────────────────────────────────────────────────────
 *   *.vercel.app                  empty    true        build passes (demo state)
 *   anything else (custom domain) empty    any         BUILD FAILS
 *   any                           empty    unset       BUILD FAILS (demo must be explicit)
 *   cannot be determined          empty    any         BUILD FAILS (fail closed)
 *   any                           set      true        BUILD FAILS (stale flag)
 *   any                           set      unset       build passes (live)
 *
 * HOW THE HOST IS READ: `VERCEL_PROJECT_PRODUCTION_URL` is the project's production
 * domain — Vercel sets it to the shortest CUSTOM domain when one is attached, and the
 * *.vercel.app domain otherwise. So the moment someone attaches justjunkitmn.com to the
 * project, every subsequent demo-mode build fails with the go-live checklist. `VERCEL_URL`
 * is deliberately NOT used: it is the per-deployment hash URL and always ends in
 * .vercel.app, so it can never detect a custom domain.
 *
 * LOCAL BUILDS (no VERCEL env): the host is "local" — determined, not unknown. A local
 * build cannot be pointed at a domain, so the demo state is allowed with the explicit
 * flag, same as vercel.app. The gap this leaves — building locally and promoting the
 * artifact to a custom-domain deployment with `vercel deploy --prebuilt` — is covered by
 * the runtime canary in components/DemoCanary.tsx.
 */

const slug = site.crm.businessSlug.trim();
const demoFlag = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/** True when this build is the demo shown to the owner: real UI, no network write. */
export const isDemoMode = slug.length === 0;

type HostKind = "vercel" | "custom" | "local" | "unknown";

function resolveHost(): { host: string; kind: HostKind } {
  if (!process.env.VERCEL) return { host: "local build (no VERCEL env)", kind: "local" };
  const host = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "").trim();
  if (!host) return { host: "(VERCEL_PROJECT_PRODUCTION_URL is unset)", kind: "unknown" };
  return { host, kind: host.endsWith(".vercel.app") ? "vercel" : "custom" };
}

const { host, kind } = resolveHost();

const RULE = "═".repeat(68);

function blocked(reason: string[]): never {
  throw new Error(
    [
      "",
      RULE,
      "  BUILD BLOCKED — Just Junk It go-live guard (lib/require-live-config.ts)",
      RULE,
      "",
      ...reason.map((l) => `  ${l}`),
      "",
      "  GOING LIVE  (all four, in order)",
      "    1. Create the Business row for Just Junk It in Neon.",
      "    2. Paste its verbatim slug into site.config.ts -> crm.businessSlug.",
      "       Copy it from the live row. Do not retype it from memory — a wrong",
      "       slug fails silently and looks identical to a working one.",
      "    3. Delete the NEXT_PUBLIC_DEMO_MODE environment variable from every",
      "       Vercel environment, then redeploy WITHOUT build cache.",
      "    4. Only then point DNS at this project.",
      "",
      "  The build refusing to complete on a custom domain while the form is in",
      "  demo configuration is INTENTIONAL. It is not a bug to work around.",
      "",
      RULE,
      "",
    ].join("\n"),
  );
}

if (slug.length > 0 && demoFlag) {
  blocked([
    "site.config.ts has a real businessSlug, but NEXT_PUBLIC_DEMO_MODE is",
    "still 'true' in this environment. That is go-live step 3, not done.",
    "Delete the variable and redeploy without cache.",
  ]);
}

if (slug.length === 0) {
  if (!demoFlag) {
    blocked([
      "crm.businessSlug is an empty string and NEXT_PUBLIC_DEMO_MODE is not",
      "set. The demo state must be explicit — set NEXT_PUBLIC_DEMO_MODE=true",
      "for a vercel.app demo, or complete the go-live steps below.",
    ]);
  }
  if (kind === "custom") {
    blocked([
      `This deployment's production host is "${host}" — a CUSTOM DOMAIN.`,
      "The quote form is in demo configuration and does not POST anywhere.",
      "Serving that on a real domain would show every visitor a success",
      "message while silently discarding every lead.",
    ]);
  }
  if (kind === "unknown") {
    blocked([
      "Running on Vercel but the deployment host could not be determined",
      `(${host}). The guard fails closed rather than guessing: a demo build`,
      "may only ship when the host is provably *.vercel.app.",
    ]);
  }
  // kind is "vercel" or "local": legitimate demo build.
}
