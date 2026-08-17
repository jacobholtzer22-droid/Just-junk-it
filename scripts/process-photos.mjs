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
];

/** Never encode below this. Under ~q68 WebP visibly smears fine leaf and gravel detail. */
const QUALITY_FLOOR = 70;

/** Resolution ladders, tried largest first. Budgets are the brief's targets. */
const edgeSet = {
  full: { suffix: "", budget: 250 * 1024, edges: [1600, 1400, 1200, 1100, 1000, 900] },
  small: { suffix: "-800", budget: 120 * 1024, edges: [800, 700, 600, 500] },
};
const suffixFor = (s) => [s.full, s.small];

const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
const dirSize = (d) =>
  !existsSync(d)
    ? 0
    : readdirSync(d).reduce((n, f) => n + statSync(path.join(d, f)).size, 0);

async function main() {
  const beforeSrc = dirSize(SRC);
  const beforeOut = dirSize(OUT);

  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  // Stage 1 — decode every distinct source once.
  const needed = [...new Set(MANIFEST.map((m) => m.src))];
  console.log(`\nStage 1: decoding ${needed.length} HEIC files via sips…`);
  for (const s of needed) {
    execFileSync("sips", ["-s", "format", "png", `${SRC}/${s}.heic`, "--out", `${TMP}/${s}.png`], {
      stdio: "ignore",
    });
  }

  // Stage 2 — orient, crop, resize, encode.
  console.log(`Stage 2: writing ${MANIFEST.length * 2} WebP files…\n`);
  const rows = [];
  for (const m of MANIFEST) {
    // .rotate() FIRST so crop fractions are relative to the upright image.
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

    /**
     * Encode to a byte BUDGET, flexing resolution before quality.
     *
     * A single fixed quality cannot work across this set. An empty basement is flat
     * toned and lands near 140 KB at q88; a birch stand full of leaves is the worst
     * case WebP has and lands near 900 KB at the same setting. Measured on IMG_0207:
     *
     *          q60    q68    q74    q80    q86
     *   1600   571    622    649    760    902     KB
     *   1200   334    364    378    442    524
     *   1000   229    249    265    305    362
     *
     * So 250 KB at 1600px would mean roughly q45 on the foliage shots, and WebP at
     * that setting smears leaf detail into mush. In a gallery whose entire job is
     * "look what we hauled", soft-but-clean beats sharp-and-artefacted.
     *
     * Therefore: hold quality at 70 or better and step the long edge down until the
     * budget is met. Flat images keep the full 1600px; busy ones settle near 1000px,
     * which is still ample for how they are actually displayed (gallery pairs, not
     * full-bleed heroes). Real output dimensions are recorded per file and written to
     * lib/photo-manifest.ts so the markup can declare truthful width/height.
     */
    const ladder = suffixFor(edgeSet);
    for (const { suffix, budget, edges } of ladder) {
      const file = `${OUT}/${m.out}${suffix}.webp`;
      let best = null, chosenQ = 0, chosenEdge = 0;

      outer: for (const edge of edges) {
        const resized = await sharp(base)
          .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
          .toBuffer();
        let lo = QUALITY_FLOOR, hi = 88, bufAt = null, qAt = 0;
        while (lo <= hi) {
          const q = Math.floor((lo + hi) / 2);
          const buf = await sharp(resized).webp({ quality: q, effort: 6 }).toBuffer();
          if (buf.length <= budget) { bufAt = buf; qAt = q; lo = q + 1; } else { hi = q - 1; }
        }
        if (bufAt) { best = bufAt; chosenQ = qAt; chosenEdge = edge; break outer; }
      }

      // Nothing on the ladder fit even at the quality floor — take the smallest edge
      // at the floor and let the report flag it rather than silently shipping it.
      if (!best) {
        const edge = edges[edges.length - 1];
        best = await sharp(base)
          .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
          .webp({ quality: QUALITY_FLOOR, effort: 6 })
          .toBuffer();
        chosenQ = QUALITY_FLOOR;
        chosenEdge = edge;
      }
      // Write the exact buffer the search measured. Passing it back through
      // sharp().toFile() would DECODE and RE-ENCODE it at sharp's default quality,
      // so the file on disk would not be the one that was measured against the budget
      // — which is how an image that "fit" 250 KB landed at 272 KB.
      writeFileSync(file, best);

      const om = await sharp(file).metadata();
      rows.push({
        key: m.out,
        file: `${m.out}${suffix}.webp`,
        variant: suffix === "" ? "full" : "800",
        width: om.width,
        height: om.height,
        dims: `${om.width}x${om.height}`,
        bytes: statSync(file).size,
        quality: chosenQ,
        exif: om.exif ? "PRESENT" : "none",
        alt: m.alt,
      });
    }
  }

  rmSync(TMP, { recursive: true, force: true });

  /**
   * Generated manifest. The markup imports this so every <Image> can declare the REAL
   * intrinsic width and height of the file it is serving. Hard-coding 1600 everywhere
   * would be a false claim now that the busy images settle lower, and a wrong
   * width/height pair is exactly what causes layout shift.
   */
  const full = rows.filter((r) => r.variant === "full");
  const thumb = rows.filter((r) => r.variant === "800");
  const manifest = full.map((r) => {
    const t = thumb.find((x) => x.key === r.key);
    return { key: r.key, src: `/photos/${r.file}`, width: r.width, height: r.height,
             smallWidth: t.width, smallHeight: t.height, alt: r.alt };
  });
  writeFileSync(
    "lib/photo-manifest.ts",
    "// GENERATED by scripts/process-photos.mjs — do not edit by hand.\n" +
      "// Run `npm run photos` to regenerate. Alt text lives in that script's MANIFEST.\n\n" +
      "export type Photo = {\n  key: string;\n  src: string;\n  width: number;\n  height: number;\n" +
      "  smallWidth: number;\n  smallHeight: number;\n  alt: string;\n};\n\n" +
      "export const photos = " + JSON.stringify(manifest, null, 2) + " as const satisfies readonly Photo[];\n\n" +
      "export const photoByKey = Object.fromEntries(photos.map((p) => [p.key, p])) as Record<string, Photo>;\n",
  );

  // ---- Report ----------------------------------------------------------------
  const leaked = rows.filter((r) => r.exif !== "none");
  console.log(`${"file".padEnd(46)} ${"dims".padEnd(11)} ${"size".padEnd(8)} ${"q".padEnd(3)} exif`);
  console.log("-".repeat(80));
  for (const r of rows) {
    console.log(`${r.file.padEnd(46)} ${r.dims.padEnd(11)} ${kb(r.bytes).padEnd(8)} ${String(r.quality).padEnd(3)} ${r.exif}`);
  }



  const over = [
    ...full.filter((r) => r.bytes > 250 * 1024).map((r) => `${r.file} ${kb(r.bytes)} > 250 KB`),
    ...thumb.filter((r) => r.bytes > 120 * 1024).map((r) => `${r.file} ${kb(r.bytes)} > 120 KB`),
  ];

  console.log("\n" + "=".repeat(74));
  console.log(`  source HEIC folder : ${kb(beforeSrc)}  (${needed.length} distinct files used)`);
  console.log(`  public/photos was  : ${kb(beforeOut)}`);
  console.log(`  public/photos now  : ${kb(dirSize(OUT))}  (${rows.length} files)`);
  console.log(`  full-size subtotal : ${kb(full.reduce((n, r) => n + r.bytes, 0))}`);
  console.log(`  800w subtotal      : ${kb(thumb.reduce((n, r) => n + r.bytes, 0))}`);
  console.log(`  EXIF leaked        : ${leaked.length === 0 ? "NONE — all stripped" : leaked.map((r) => r.file).join(", ")}`);
  console.log(`  over budget        : ${over.length === 0 ? "none" : "\n    " + over.join("\n    ")}`);
  console.log("=".repeat(74) + "\n");

  if (leaked.length || over.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
