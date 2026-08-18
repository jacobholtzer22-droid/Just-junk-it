/**
 * Preflight go-live guard — domain-aware. Runs BEFORE `next build` via the npm scripts.
 *
 * Early-warning layer: fails in under a second with a readable message before Next prints
 * a wall of output. The authoritative check is lib/require-live-config.ts, imported by
 * the root layout. THE TWO MUST AGREE — if you change a rule here, change it there.
 *
 * The rule table, keyed on the deployment DOMAIN (see require-live-config.ts for why):
 *
 *   HOST                          SLUG     DEMO FLAG   RESULT
 *   ─────────────────────────────────────────────────────────────────────
 *   *.vercel.app                  empty    true        pass (demo state)
 *   custom domain                 empty    any         FAIL
 *   any                           empty    unset       FAIL (demo must be explicit)
 *   undetermined (on Vercel)      empty    any         FAIL (fail closed)
 *   any                           set      true        FAIL (stale flag)
 *   any                           set      unset       pass (live)
 *
 * FAILS CLOSED on the slug too: if the businessSlug literal cannot be located in
 * site.config.ts at all, that is a failure, not a pass.
 */
import { readFileSync } from "node:fs";

const FILE = "site.config.ts";
const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const rule = "═".repeat(68);

const GO_LIVE_STEPS = [
  "",
  "  GOING LIVE  (all four, in order)",
  "    1. Create the Business row for Just Junk It in Neon.",
  `    2. Paste its verbatim slug into ${FILE} -> crm.businessSlug.`,
  "       Copy it from the live row — a wrong slug fails silently.",
  "    3. Delete NEXT_PUBLIC_DEMO_MODE from every Vercel environment,",
  "       then redeploy WITHOUT build cache.",
  "    4. Only then point DNS at this project.",
  "",
  "  The build refusing to complete on a custom domain while the form is in",
  "  demo configuration is INTENTIONAL. It is not a bug to work around.",
];

function fail(lines) {
  console.error(`\n${rule}\n${lines.join("\n")}\n${rule}\n`);
  process.exit(1);
}

/** Same resolution as require-live-config.ts. VERCEL_URL is deliberately not used —
 *  it is the per-deployment hash and always ends in .vercel.app. */
function resolveHost() {
  if (!process.env.VERCEL) return { host: "local build (no VERCEL env)", kind: "local" };
  const host = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "").trim();
  if (!host) return { host: "(VERCEL_PROJECT_PRODUCTION_URL is unset)", kind: "unknown" };
  return { host, kind: host.endsWith(".vercel.app") ? "vercel" : "custom" };
}

let source;
try {
  source = readFileSync(FILE, "utf8");
} catch {
  fail(["  PREFLIGHT FAILED — cannot read site.config.ts", "", "  Run the build from the project root."]);
}

const match = source.match(/businessSlug\s*:\s*(["'])(.*?)\1/);
if (!match) {
  fail([
    "  PREFLIGHT FAILED — could not find a `businessSlug` string literal in",
    `  ${FILE}. The guard reads that literal to decide whether this build is`,
    "  safe to ship; it must stay a plain quoted string on one line.",
    "  This check fails closed on purpose. Restore the literal and rebuild.",
  ]);
}

const slug = match[2].trim();
const { host, kind } = resolveHost();

if (slug.length > 0 && DEMO) {
  fail([
    "  BUILD BLOCKED — go-live is half finished.",
    "",
    `  ${FILE} has a real businessSlug ("${slug}"), so the form WILL post. But`,
    "  NEXT_PUBLIC_DEMO_MODE is still 'true' in this environment — that is",
    "  go-live step 3, not done. Delete the variable and redeploy without cache.",
  ]);
}

if (slug.length === 0) {
  if (!DEMO) {
    fail([
      "  BUILD BLOCKED — Just Junk It is still in demo configuration.",
      "",
      `  ${FILE} -> crm.businessSlug is an empty string and NEXT_PUBLIC_DEMO_MODE`,
      "  is not set. The demo state must be explicit: set NEXT_PUBLIC_DEMO_MODE=true",
      "  for a vercel.app demo, or complete the go-live steps.",
      ...GO_LIVE_STEPS,
    ]);
  }
  if (kind === "custom") {
    fail([
      "  BUILD BLOCKED — demo configuration on a CUSTOM DOMAIN.",
      "",
      `  This project's production host is "${host}". The quote form does not`,
      "  POST anywhere in demo configuration; serving it on a real domain would",
      "  show every visitor a success message while discarding every lead.",
      ...GO_LIVE_STEPS,
    ]);
  }
  if (kind === "unknown") {
    fail([
      "  BUILD BLOCKED — deployment host could not be determined.",
      "",
      `  Running on Vercel but ${host}. The guard fails closed rather than`,
      "  guessing: a demo build may only ship when the host is provably",
      "  *.vercel.app.",
      ...GO_LIVE_STEPS,
    ]);
  }
  console.log(
    `\n  ▸ preflight: DEMO build on ${kind === "local" ? "local machine" : host} — ` +
      `quote form will not POST.\n    vercel.app / local hosts only; a custom domain fails this build.\n`,
  );
} else {
  console.log(`\n  ▸ preflight: LIVE build — businessSlug "${slug}".\n`);
}
