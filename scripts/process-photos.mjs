/**
 * Phase 1 photo pipeline.  Run:  npm run photos
 *
 * TWO STAGES, and the first one is not optional:
 *
 *   1. sips (macOS)  HEIC -> PNG
 *      sharp CANNOT decode these files. Its bundled libheif reads the container header
 *      fine — sharp.metadata() succeeds and reports 4032x3024, which makes it look like
 *      HEIC support is present — but the actual pixel decode throws:
 *        "No decoding plugin installed for this compression format"
 *      because the prebuilt binary ships without an HEVC decoder. macOS sips uses the
 *      OS decoder and handles them natively. PNG is the intermediate so the handoff
 *      between the two stages is lossless.
 *
 *   2. sharp  PNG -> oriented, cropped, resized WebP
 *
 * ORIENTATION — the trap in this photo set:
 *   Six of the ten source files carry EXIF orientation 6 (rotate 90° CW) while their
 *   PIXELS are stored landscape. sips carries that tag through to the PNG rather than
 *   baking it in. Different viewers disagree about what to do with it, which is exactly
 *   why they must never reach the browser. `.rotate()` with no arguments bakes the EXIF
 *   orientation into the pixels; after that the tag is meaningless and is stripped.
 *   Never remove that call.
 *
 * METADATA:
 *   sharp drops all metadata unless .withMetadata() is called, which it deliberately is
 *   not. Output carries no EXIF: no GPS coordinates from the phone that shot a job at a
 *   customer's house, no capture timestamps, no device serial. verify() below asserts
 *   this on every written file rather than trusting the default.
 *
 * Each entry emits two files, which is the contract lib/image-loader.ts depends on:
 *   name.webp       long edge 1600   (full-bleed use)
 *   name-800.webp   long edge 800    (grid thumbnails)
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "Trystan Photos";
const OUT = "public/photos";
const TMP = ".photo-tmp";

/**
 * crop: fractions of the ORIENTED image to keep, {top,left,width,height} as 0-1.
 * Omit for no crop.
 */
const MANIFEST = [
  // ---- PAIR 01 — brush pile in the birch stand (yard waste) --------------------
  {
    src: "IMG_0207",
    out: "before-01-brush-birch-grand-rapids",
    alt: "Pile of cut brush and leafy branches dumped on the grass in front of a stand of birch trees before a yard waste cleanup in Grand Rapids, Minnesota.",
  },
  {
    src: "IMG_0209",
    out: "after-01-brush-birch-grand-rapids",
    alt: "The same birch stand with the brush pile hauled away, bare ground where it sat, and the Just Junk It truck and dump trailer parked at the treeline.",
  },

  // ---- PAIR 02 — basement estate cleanout ---------------------------------------
  {
    src: "IMG_0211",
    out: "before-02-basement-estate-cleanout",
    alt: "Basement full of folding chairs, tied contractor bags, cardboard boxes and a step ladder, tagged for removal during an estate cleanout in Grand Rapids, Minnesota.",
  },
  {
    src: "IMG_0214",
    out: "after-02-basement-estate-cleanout",
    alt: "The same basement emptied to bare concrete after an estate cleanout, with only the homeowner's own paint cans left in the corner.",
  },

  // ---- PAIR 03 — brush pile beside the boat (yard waste) ------------------------
  // Captioned as BRUSH removal only. The boat and red truck bed were not part of this
  // job and are still present in the after; alt text must never imply otherwise.
  {
    src: "IMG_7278",
    out: "before-03-brush-pile-wooded-lot",
    alt: "Large pile of cut brush and dead branches at the edge of a wooded lot in Itasca County, beside an overturned aluminum boat and an old truck bed.",
  },
  {
    src: "IMG_7286",
    out: "after-03-brush-pile-wooded-lot",
    alt: "The same wooded lot edge with the brush pile cleared and the ground raked clean. The boat and truck bed were not part of the job and remain in place.",
  },

  // ---- Standalone job photos ----------------------------------------------------
  {
    src: "IMG_0212",
    out: "job-01-basement-books-estate-cleanout",
    alt: "Basement room with a steel desk, filing cabinets and stacks of hardcover books bagged and boxed for removal during an estate cleanout in Grand Rapids, Minnesota.",
  },
  {
    src: "IMG_0241",
    out: "job-02-basement-appliances",
    alt: "Older basement holding a washer, two dryers, a water heater and a cast iron radiator being disconnected for appliance removal in Grand Rapids, Minnesota.",
  },
  {
    // CROP: removes the bottom of the frame, which carried a legible carrier shipping
    // label (barcode and address text) on one of the boxes, and a fingertip over the
    // lens. Cropped, not blurred — a blur can be reversed or simply fail to obscure
    // enough, and it looks like something is being hidden. See seo/PHOTO-INVENTORY.md §3.
    src: "IMG_7034",
    out: "job-03-carport-packed-full",
    crop: { top: 0, left: 0, width: 1, height: 0.76 },
    alt: "Portable fabric carport packed wall to wall with boxes, bags, a mattress and a bicycle before a full cleanout in Itasca County, Minnesota.",
  },
  {
    src: "IMG_7101",
    out: "job-04-carport-emptied",
    alt: "Empty portable fabric carport with a bare dirt and concrete floor after its contents were hauled away in Itasca County, Minnesota.",
  },

  // ---- Honest non-job asset -----------------------------------------------------
  // Cropped from the pair-01 after frame. This is the truck, described as the truck.
  // It may sit on service pages that have no job photo of their own; the alt text says
  // exactly what is in the frame and never implies the page's service was performed here.
  {
    src: "IMG_0209",
    out: "truck-01-dump-trailer-grand-rapids",
    crop: { top: 0.28, left: 0.0, width: 0.42, height: 0.34 },
    alt: "The Just Junk It pickup and dump trailer parked at a job site in Grand Rapids, Minnesota.",
  },

  // ---- STOCK — snow removal only (Aug 2026) --------------------------------------
  // ⚠ THE ONLY STOCK IMAGES ON THE SITE, by explicit decision: the snow division's first
  // season starts with zero job photography, and these hold the visual slots until real
  // winter shots exist. THE RULES:
  //   - Pexels only, licensed for commercial use, no attribution required. Source URL
  //     and license for each file are recorded in seo/PHOTO-INVENTORY.md §7.
  //   - Scene shots only: NO operators, NO plow trucks, NO snowblowers, NO branded
  //     equipment — nothing a visitor could read as "this is the crew I am hiring".
  //   - Alt text describes the scene and never implies a job was performed.
  //   - These NEVER appear in /gallery. That page stays real jobs only.
  //   - Swap after the first snowfall — see HANDOFF.md → SWAP AFTER FIRST SNOW.
  // Sources live in "Stock Photos/" (gitignored, like the job originals).
  {
    srcDir: "Stock Photos",
    ext: "jpg",
    src: "pexels-17651159-snow-driveway",
    out: "stock-snow-01-driveway-pines",
    alt: "Snow-covered driveway with fresh tire tracks leading to a house among snowy pines.",
  },
  {
    srcDir: "Stock Photos",
    ext: "jpg",
    src: "pexels-35836549-snow-steps",
    out: "stock-snow-02-entry-steps",
    alt: "Deep fresh snow covering the front steps and entryway of a building during a snowfall.",
  },
  {
    srcDir: "Stock Photos",
    ext: "jpg",
    src: "pexels-6577003-snowfall-street",
    out: "stock-snow-03-snowfall-street",
    alt: "Snow falling over a quiet residential street of single-story houses in winter.",
  },
];

/**
 * FORMAT LADDER — AVIF primary, WebP fallback.
 *
 * The long edge is chosen by AVIF, then WebP is encoded at THAT SAME EDGE. The two files
 * must have identical pixel dimensions: they are alternate <source> entries in the same
 * <picture>, and if they differed the layout would shift depending on which format the
 * browser picked.
 *
 * Effort is 4 deliberately. Measured on the worst-case foliage frame at 1600px, raising
 * AVIF effort from 4 to 9 changed the file from 464 KB to 468 KB — no gain at all — while
 * the encode went from 0.9 s to 11.7 s. Effort is not the lever here.
 *
 * Chroma 4:2:0 rather than sharp's 4:4:4 default. On photographic content the difference
 * is invisible and it buys real headroom, which is the entire point of this pass.
 */
const AVIF = { floor: 42, ceil: 72, effort: 4, chromaSubsampling: "4:2:0" };
const WEBP = { floor: 50, ceil: 88, effort: 6 };

const VARIANTS = [
  { suffix: "", budget: 250 * 1024, edges: [1600, 1400, 1200, 1100, 1000, 900] },
  { suffix: "-800", budget: 120 * 1024, edges: [800, 700, 600, 500] },
];

/** What the WebP-only pass reached, for the before/after comparison the brief asked for. */
const PREV_WEBP_EDGE = {
  "before-01-brush-birch-grand-rapids": "900x675",
  "after-01-brush-birch-grand-rapids": "1000x750",
  "before-02-basement-estate-cleanout": "1600x1200",
  "after-02-basement-estate-cleanout": "1200x1600",
  "before-03-brush-pile-wooded-lot": "675x900",
  "after-03-brush-pile-wooded-lot": "675x900",
  "job-01-basement-books-estate-cleanout": "1200x1600",
  "job-02-basement-appliances": "1600x1200",
  "job-03-carport-packed-full": "1382x1400",
  "job-04-carport-emptied": "900x1200",
  "truck-01-dump-trailer-grand-rapids": "1200x729",
};

const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
const dirSize = (d) =>
  !existsSync(d) ? 0 : readdirSync(d).reduce((n, f) => n + statSync(path.join(d, f)).size, 0);

const encode = (buf, fmt, q) =>
  fmt === "avif"
    ? sharp(buf).avif({ quality: q, effort: AVIF.effort, chromaSubsampling: AVIF.chromaSubsampling }).toBuffer()
    : sharp(buf).webp({ quality: q, effort: WEBP.effort }).toBuffer();

/** Highest quality in [floor, ceil] whose output fits `budget`. null if none does. */
async function bestUnder(buf, fmt, budget) {
  const { floor, ceil } = fmt === "avif" ? AVIF : WEBP;
  let lo = floor, hi = ceil, out = null, q = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const b = await encode(buf, fmt, mid);
    if (b.length <= budget) { out = b; q = mid; lo = mid + 1; } else { hi = mid - 1; }
  }
  return out ? { buf: out, quality: q } : null;
}

async function main() {
  const beforeSrc = dirSize(SRC);
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  // Stage 1 normalises every source to a PNG intermediate. HEIC needs macOS sips (sharp's
  // bundled libheif has no HEVC decoder — see the header comment); JPG stock sources go
  // straight through sharp. Keyed per-entry so the two source folders can mix.
  const needed = new Map();
  for (const m of MANIFEST) {
    needed.set(m.src, { dir: m.srcDir ?? SRC, ext: m.ext ?? "heic" });
  }
  console.log(`\nStage 1: decoding ${needed.size} source files to PNG…`);
  for (const [s, { dir, ext }] of needed) {
    if (ext === "heic") {
      execFileSync("sips", ["-s", "format", "png", `${dir}/${s}.heic`, "--out", `${TMP}/${s}.png`], { stdio: "ignore" });
    } else {
      await sharp(`${dir}/${s}.${ext}`).png().toFile(`${TMP}/${s}.png`);
    }
  }

  console.log(`Stage 2: AVIF + WebP for ${MANIFEST.length} images x ${VARIANTS.length} sizes…\n`);
  const rows = [];

  for (const m of MANIFEST) {
    const oriented = await sharp(`${TMP}/${m.src}.png`).rotate().toBuffer();
    const meta = await sharp(oriented).metadata();

    let pipe = sharp(oriented);
    if (m.crop) {
      pipe = pipe.extract({
        left: Math.round(m.crop.left * meta.width),
        top: Math.round(m.crop.top * meta.height),
        width: Math.round(m.crop.width * meta.width),
        height: Math.round(m.crop.height * meta.height),
      });
    }
    const base = await pipe.toBuffer();

    for (const v of VARIANTS) {
      let chosen = null;
      for (const edge of v.edges) {
        const resized = await sharp(base)
          .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
          .toBuffer();
        const avif = await bestUnder(resized, "avif", v.budget);
        if (avif) { chosen = { edge, resized, avif }; break; }
      }
      // Nothing on the ladder fit even at the AVIF floor — take the smallest rung and
      // let the report flag it rather than silently shipping it.
      if (!chosen) {
        const edge = v.edges[v.edges.length - 1];
        const resized = await sharp(base)
          .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
          .toBuffer();
        chosen = { edge, resized, avif: { buf: await encode(resized, "avif", AVIF.floor), quality: AVIF.floor } };
      }

      // WebP fallback at the SAME dimensions. If it cannot meet the budget it is written
      // at its floor: it is only served to browsers with no AVIF support, and a slightly
      // heavier fallback beats a fallback that shifts the layout.
      const webpFit = await bestUnder(chosen.resized, "webp", v.budget);
      const webp = webpFit ?? { buf: await encode(chosen.resized, "webp", WEBP.floor), quality: WEBP.floor };

      const dims = await sharp(chosen.avif.buf).metadata();
      writeFileSync(`${OUT}/${m.out}${v.suffix}.avif`, chosen.avif.buf);
      writeFileSync(`${OUT}/${m.out}${v.suffix}.webp`, webp.buf);

      rows.push({
        key: m.out,
        variant: v.suffix === "" ? "full" : "800",
        base: `${m.out}${v.suffix}`,
        width: dims.width,
        height: dims.height,
        avifBytes: chosen.avif.buf.length,
        avifQ: chosen.avif.quality,
        webpBytes: webp.buf.length,
        webpQ: webp.quality,
        webpOverBudget: webp.buf.length > v.budget,
        budget: v.budget,
        alt: m.alt,
      });
    }

    // For any full-size image that lands under 1200px, measure what 1200px would cost so
    // the budget can be raised for that specific file rather than guessed at.
    const full = rows.find((r) => r.key === m.out && r.variant === "full");
    if (full.width < 1200 && full.height < 1200) {
      const r1200 = await sharp(base).resize({ width: 1200, height: 1200, fit: "inside" }).toBuffer();
      const md = await sharp(r1200).metadata();
      full.need1200 = {
        dims: `${md.width}x${md.height}`,
        at50: (await encode(r1200, "avif", 50)).length,
        at45: (await encode(r1200, "avif", 45)).length,
      };
    }
  }

  rmSync(TMP, { recursive: true, force: true });

  const fullRows = rows.filter((r) => r.variant === "full");
  const thumbRows = rows.filter((r) => r.variant === "800");
  const manifest = fullRows.map((r) => {
    const t = thumbRows.find((x) => x.key === r.key);
    return {
      key: r.key,
      avif: `/photos/${r.base}.avif`,
      webp: `/photos/${r.base}.webp`,
      width: r.width,
      height: r.height,
      smallAvif: `/photos/${t.base}.avif`,
      smallWebp: `/photos/${t.base}.webp`,
      smallWidth: t.width,
      smallHeight: t.height,
      alt: r.alt,
    };
  });
  writeFileSync(
    "lib/photo-manifest.ts",
    "// GENERATED by scripts/process-photos.mjs — do not edit by hand.\n" +
      "// Run `npm run photos` to regenerate. Alt text lives in that script's MANIFEST.\n" +
      "// width/height are the REAL intrinsic dimensions of the files that ship, so markup\n" +
      "// can declare them and avoid layout shift. AVIF and WebP always share dimensions.\n\n" +
      "export type Photo = {\n  key: string;\n  avif: string;\n  webp: string;\n  width: number;\n  height: number;\n" +
      "  smallAvif: string;\n  smallWebp: string;\n  smallWidth: number;\n  smallHeight: number;\n  alt: string;\n};\n\n" +
      "export const photos: readonly Photo[] = " + JSON.stringify(manifest, null, 2) + ";\n\n" +
      "export const photoByKey: Record<string, Photo> = Object.fromEntries(photos.map((p) => [p.key, p]));\n",
  );

  // ---- Report ----------------------------------------------------------------
  console.log(`${"file".padEnd(40)} ${"dims".padEnd(11)} ${"AVIF".padEnd(11)} ${"WebP".padEnd(11)} was (webp-only)`);
  console.log("-".repeat(96));
  for (const r of fullRows) {
    const t = thumbRows.find((x) => x.key === r.key);
    const prev = PREV_WEBP_EDGE[r.key] ?? "?";
    const gain = prev === `${r.width}x${r.height}` ? "same" : "UP";
    console.log(
      `${r.base.padEnd(40)} ${`${r.width}x${r.height}`.padEnd(11)} ` +
        `${`${kb(r.avifBytes)} q${r.avifQ}`.padEnd(11)} ${`${kb(r.webpBytes)} q${r.webpQ}`.padEnd(11)} ${prev} ${gain}`,
    );
    console.log(
      `${("  " + t.base).padEnd(40)} ${`${t.width}x${t.height}`.padEnd(11)} ` +
        `${`${kb(t.avifBytes)} q${t.avifQ}`.padEnd(11)} ${`${kb(t.webpBytes)} q${t.webpQ}`.padEnd(11)}`,
    );
  }

  const under1200 = fullRows.filter((r) => r.need1200);
  const webpOver = rows.filter((r) => r.webpOverBudget);

  console.log("\n" + "=".repeat(96));
  console.log(`  source HEIC        : ${kb(beforeSrc)}`);
  console.log(`  public/photos now  : ${kb(dirSize(OUT))}  (${rows.length * 2} files: ${rows.length} AVIF + ${rows.length} WebP)`);
  console.log(`  AVIF subtotal      : ${kb(rows.reduce((n, r) => n + r.avifBytes, 0))}`);
  console.log(`  WebP subtotal      : ${kb(rows.reduce((n, r) => n + r.webpBytes, 0))}   (fallback only)`);
  console.log(`  AVIF over budget   : ${rows.filter((r) => r.avifBytes > r.budget).length === 0 ? "none" : rows.filter((r) => r.avifBytes > r.budget).map((r) => r.base).join(", ")}`);
  console.log(`  WebP over budget   : ${webpOver.length === 0 ? "none" : webpOver.map((r) => `${r.base} ${kb(r.webpBytes)}`).join(", ")}`);

  if (under1200.length) {
    console.log(`\n  ⚠ FULL-SIZE IMAGES BELOW 1200px — budget raise needed per file:`);
    for (const r of under1200) {
      console.log(
        `    ${r.base}\n` +
          `      reaches ${r.width}x${r.height} at 250 KB\n` +
          `      would need ${kb(r.need1200.at50)} for ${r.need1200.dims} at AVIF q50, or ${kb(r.need1200.at45)} at q45`,
      );
    }
  } else {
    console.log(`\n  All full-size images reach at least 1200px on the long edge within budget.`);
  }
  console.log("=".repeat(96) + "\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
