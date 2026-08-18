"use client";

import { useEffect } from "react";
import { isDemoMode } from "@/lib/require-live-config";

/**
 * RUNTIME CANARY — the third guard layer.
 *
 * The two build-time guards cannot see a build that was PROMOTED rather than rebuilt:
 * build once for a vercel.app host, attach a custom domain later (or `vercel deploy
 * --prebuilt` a local artifact), and no build ever runs on the new host. If that ever
 * happens while the form is in demo configuration, this logs a loud console error on
 * every page load naming the file and the fix.
 *
 * It checks window.location.hostname — the host the visitor is ACTUALLY on, which no
 * build-time variable can know. localhost/127.0.0.1 and *.vercel.app are the only hosts
 * where the demo state is legitimate.
 *
 * Renders nothing, ever. In a live build (slug set) the effect body is unreachable.
 */
export default function DemoCanary() {
  useEffect(() => {
    if (!isDemoMode) return;
    const host = window.location.hostname;
    const ok =
      host === "localhost" || host === "127.0.0.1" || host.endsWith(".vercel.app");
    if (ok) return;
    console.error(
      `[Just Junk It] ⚠ DEMO BUILD ON A REAL DOMAIN (${host}). ` +
        "The quote form is NOT posting — every visitor sees a success message and every " +
        "lead is silently discarded. This build was promoted to this domain without a " +
        "rebuild, which is the one path the build-time guards cannot catch. " +
        "Fix now: create the Neon Business row, paste its verbatim slug into " +
        "site.config.ts -> crm.businessSlug, delete NEXT_PUBLIC_DEMO_MODE from every " +
        "Vercel environment, and redeploy WITHOUT build cache. " +
        "See lib/require-live-config.ts and the GO LIVE checklist in HANDOFF.md.",
    );
  }, []);

  return null;
}
