/**
 * JSON-LD verification against the BUILT HTML.  node scripts/verify-schema.mjs
 *
 * STRUCTURAL, not substring. A naive scan for the literal "Review" flagged /reviews —
 * the match was the breadcrumb LABEL "Reviews", not a Review entity. A checker that cries
 * wolf gets ignored, so this one walks the parsed object graph and only reports a real
 * `@type: "Review"` node or a real `aggregateRating` / `ratingValue` KEY.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const DIR = ".next/server/app";
const REAL = new Set(["LocalBusiness","WebSite","Organization","BreadcrumbList","Service",
  "FAQPage","Question","Answer","ListItem","Place","AdministrativeArea","OpeningHoursSpecification"]);
const BANNED_TYPES = new Set(["Review", "AggregateRating"]);
const BANNED_KEYS = new Set(["aggregateRating", "ratingValue", "reviewCount", "bestRating", "review"]);

function walk(node, hit) {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, hit));
  if (!node || typeof node !== "object") return;
  if (typeof node["@type"] === "string") {
    if (BANNED_TYPES.has(node["@type"])) hit.types.push(node["@type"]);
    else if (!REAL.has(node["@type"])) hit.unknown.push(node["@type"]);
  }
  for (const k of Object.keys(node)) {
    if (BANNED_KEYS.has(k)) hit.keys.push(k);
    walk(node[k], hit);
  }
}

let total = 0, failures = 0;
const files = readdirSync(DIR).filter((f) => f.endsWith(".html") && f !== "_not-found.html").sort();

console.log(`\n${"page".padEnd(32)}${"blocks".padStart(7)}  result`);
console.log("-".repeat(72));

for (const f of files) {
  const html = readFileSync(path.join(DIR, f), "utf8");
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, "");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const problems = [];
  for (const b of blocks) {
    total++;
    let d;
    try { d = JSON.parse(b.replace(/\\u003c/g, "<")); }
    catch { problems.push("PARSE FAIL"); continue; }
    if (!d["@context"]) problems.push(`${d["@type"]} missing @context`);
    const hit = { types: [], keys: [], unknown: [] };
    walk(d, hit);
    if (hit.types.length) problems.push(`banned @type ${[...new Set(hit.types)]}`);
    if (hit.keys.length) problems.push(`banned key ${[...new Set(hit.keys)]}`);
    if (hit.unknown.length) problems.push(`non-schema.org @type ${[...new Set(hit.unknown)]}`);
    if (d["@type"] === "FAQPage") {
      const missing = d.mainEntity.filter((q) => !visible.includes(q.name) && !visible.includes(q.name.replace(/&/g, "&amp;")));
      if (missing.length) problems.push(`FAQPage asserts ${missing.length} question(s) not rendered on the page`);
    }
  }
  if (problems.length) failures += problems.length;
  const slug = "/" + f.replace(".html", "").replace("index", "");
  console.log(`${slug.padEnd(32)}${String(blocks.length).padStart(7)}  ${problems.length ? "FAIL: " + problems.join("; ") : "pass"}`);
}

console.log("-".repeat(72));
console.log(`  ${total} blocks across ${files.length} pages · ${failures === 0 ? "ALL PASS" : failures + " FAILURES"}`);
console.log(`  no Review entity, no AggregateRating, no ratingValue anywhere: ${failures === 0 ? "confirmed" : "see above"}\n`);
process.exit(failures === 0 ? 0 : 1);
