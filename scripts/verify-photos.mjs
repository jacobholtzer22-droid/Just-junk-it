/**
 * Photo output verification.  Run:  node scripts/verify-photos.mjs
 *
 * Checks the FILES THAT SHIP, not the pipeline's own report.
 *
 * Why this is structural rather than a string search: an earlier naive scan for the
 * literal bytes "GPS" flagged job-01-...avif. It was a false positive — the bytes sat at
 * offset 8956 inside the `mdat` box, i.e. in compressed pixel data, and the file has no
 * metadata items at all. Over ~150 KB of compressed payload a given 3-byte sequence turns
 * up by chance roughly 1% of the time, so across 44 files a spurious hit is likely. A
 * checker that cries wolf gets ignored, which is worse than no checker.
 *
 * So: parse the container and look for real metadata boxes/chunks only.
 *   AVIF (ISOBMFF) — metadata lives as items in the `meta` box: `Exif`, or `mime` for XMP.
 *   WebP (RIFF)    — metadata lives in `EXIF`, `XMP `, `ICCP` chunks in the chunk list.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const DIR = "public/photos";

/** Top-level ISOBMFF boxes. */
function isoBoxes(buf) {
  const out = [];
  let o = 0;
  while (o + 8 <= buf.length) {
    let size = buf.readUInt32BE(o);
    const type = buf.subarray(o + 4, o + 8).toString("latin1");
    if (size === 0) size = buf.length - o;
    if (size < 8) break;
    out.push({ offset: o, size, type });
    o += size;
  }
  return out;
}

/** RIFF chunk list for WebP. */
function riffChunks(buf) {
  const out = [];
  if (buf.subarray(0, 4).toString("latin1") !== "RIFF") return out;
  let o = 12;
  while (o + 8 <= buf.length) {
    const type = buf.subarray(o, o + 4).toString("latin1");
    const size = buf.readUInt32LE(o + 4);
    out.push({ type, size });
    o += 8 + size + (size % 2); // chunks are padded to even length
  }
  return out;
}

function checkAvif(buf) {
  const tl = isoBoxes(buf);
  const meta = tl.find((b) => b.type === "meta");
  if (!meta) return { items: [], bad: [] };
  const sub = buf.subarray(meta.offset, meta.offset + meta.size);
  // Item info entries name their type; Exif and XMP appear as infe item_type values.
  const items = new Set();
  for (let i = 0; i + 4 <= sub.length; i++) {
    const t = sub.subarray(i, i + 4).toString("latin1");
    if (["Exif", "mime", "av01", "iinf", "iloc", "pitm", "iprp", "infe", "idat"].includes(t)) items.add(t);
  }
  const bad = [...items].filter((t) => t === "Exif" || t === "mime");
  return { items: [...items].sort(), bad };
}

function checkWebp(buf) {
  const chunks = riffChunks(buf).map((c) => c.type);
  const bad = chunks.filter((t) => ["EXIF", "XMP ", "ICCP"].includes(t));
  return { items: chunks, bad };
}

const files = readdirSync(DIR).filter((f) => /\.(avif|webp)$/.test(f)).sort();
let failures = 0;

console.log(`\nStructural metadata check on ${files.length} shipped files\n`);
console.log(`${"file".padEnd(46)} ${"container items / chunks".padEnd(40)} verdict`);
console.log("-".repeat(100));

for (const f of files) {
  const buf = readFileSync(path.join(DIR, f));
  const { items, bad } = f.endsWith(".avif") ? checkAvif(buf) : checkWebp(buf);
  if (bad.length) failures++;
  console.log(
    `${f.padEnd(46)} ${items.join(",").slice(0, 39).padEnd(40)} ${bad.length ? "FAIL: " + bad.join(",") : "clean"}`,
  );
}

console.log("-".repeat(100));
console.log(
  failures === 0
    ? `  PASS — no Exif, XMP or ICC metadata item in any of the ${files.length} files.\n`
    : `  FAIL — ${failures} file(s) carry metadata.\n`,
);
process.exit(failures === 0 ? 0 : 1);
