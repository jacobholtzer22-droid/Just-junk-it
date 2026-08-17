/**
 * Preflight go-live guard. Runs BEFORE `next build` via the npm "build" script.
 *
 * This is the early-warning layer. The authoritative check is lib/require-live-config.ts,
 * which reads the parsed config value and is imported by the root layout. This one reads
 * site.config.ts as text so it can fail in under a second with a readable message,
 * before Next prints a wall of its own output.
 *
 * FAILS CLOSED: if the businessSlug line cannot be located at all, that is treated as a
 * failure, not a pass. A config refactor that hides the value must not silently disable
 * the guard.
 */
import { readFileSync, existsSync } from "node:fs";

const FILE = "site.config.ts";

/**
 * Load .env files the way Next does, because this script is a bare node process and
 * would otherwise not see them.
 *
 * This matters more than it looks. If preflight read only process.env while the layout
 * guard (which runs inside Next, after Next has loaded .env.local) saw a different
 * value, the two layers would disagree about whether the build is safe — and a safety
 * guard whose halves contradict each other is worse than a single guard, because you
 * stop trusting either.
 *
 * Precedence, matching Next: real process.env wins, then .env.local, then .env.
 */
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue; // comments and blanks
      const key = m[1];
      if (key in process.env) continue; // already set — do not override
      process.env[key] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv();

const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const rule = "═".repeat(68);

function fail(lines) {
  console.error(`\n${rule}\n${lines.join("\n")}\n${rule}\n`);
  process.exit(1);
}

let source;
try {
  source = readFileSync(FILE, "utf8");
} catch {
  fail([
    "  PREFLIGHT FAILED — cannot read site.config.ts",
    "",
    "  Run the build from the project root.",
  ]);
}

// Match:  businessSlug: "..."  |  businessSlug: '...'
const match = source.match(/businessSlug\s*:\s*(["'])(.*?)\1/);

if (!match) {
  fail([
    "  PREFLIGHT FAILED — could not find a `businessSlug` string literal in",
    `  ${FILE}.`,
    "",
    "  The go-live guard reads that literal to decide whether this build is safe",
    "  to ship. It must stay a plain quoted string on one line — no env var, no",
    "  `??` fallback, no computed value, no import.",
    "",
    "  This check fails closed on purpose. Restore the literal and rebuild.",
  ]);
}

const slug = match[2].trim();

if (slug.length === 0 && !DEMO) {
  fail([
    "  BUILD BLOCKED — Just Junk It is still in demo configuration.",
    "",
    `  ${FILE}  ->  crm.businessSlug  is an empty string.`,
    "",
    "  In this state the quote form does not POST anywhere. Shipping it to a real",
    "  domain would show visitors a success message while every lead is silently",
    "  discarded.",
    "",
    "  GOING LIVE  (all three, in order)",
    "    1. Create the Business row for Just Junk It in Neon.",
    `    2. Paste its verbatim slug into ${FILE} -> crm.businessSlug.`,
    "       Copy it from the live row — a wrong slug fails silently.",
    "    3. Delete NEXT_PUBLIC_DEMO_MODE from the deployment, redeploy with no cache.",
    "",
    "  STAYING A DEMO",
    "    Set  NEXT_PUBLIC_DEMO_MODE=true  in this environment.",
    "    Preview deployments only. Never on a custom domain.",
  ]);
}

// Stale env var. Not dangerous on its own — runtime behavior keys off the slug, not
// this variable, so the form does POST correctly here. It fails anyway because it means
// go-live step 3 was skipped, and because an environment that still advertises demo mode
// makes it impossible to tell at a glance whether a deployment is live.
if (slug.length > 0 && DEMO) {
  fail([
    "  BUILD BLOCKED — go-live is half finished.",
    "",
    `  ${FILE} has a real businessSlug ("${slug}"), so the form WILL post and leads`,
    "  will land. But NEXT_PUBLIC_DEMO_MODE is still 'true' in this environment.",
    "",
    "  That is step 3 of the go-live checklist, not done. Leaving it set means nobody",
    "  can tell from the environment whether this deployment is the owner's demo or",
    "  the live site.",
    "",
    "  Delete NEXT_PUBLIC_DEMO_MODE from this environment and redeploy without cache.",
  ]);
}

if (slug.length === 0) {
  console.log(
    "\n  ▸ preflight: DEMO build — quote form will not POST (businessSlug empty,\n" +
      "    NEXT_PUBLIC_DEMO_MODE=true). Preview URLs only.\n",
  );
} else {
  console.log(`\n  ▸ preflight: LIVE build — businessSlug "${slug}".\n`);
}
