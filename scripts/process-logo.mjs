/**
 * Logo pipeline — one-off but reproducible.  Run:  node scripts/process-logo.mjs
 *
 * Source: the PNG Jacob dropped into "Trystan Photos/" (camera-roll filename). It is
 * 1536x1024 RGB — a RASTER with a BAKED-IN near-black background and NO alpha channel.
 *
 * AUG 2026 REWORK — why this script now keys transparency after all:
 *   The earlier version shipped the logo opaque, betting its black was "visually
 *   identical" to the site's ink #0B0B0C. It was not — the logo's field measures
 *   #010000 (sampled below, printed on every run), eleven levels darker, and the
 *   lockup sat in a visible rectangle on every surface. Two-part fix:
 *     1. The site's base token (`ink` in tailwind.config.ts) is now set to the SAMPLED
 *        logo black, so the logo's own interior field merges with the page.
 *     2. The EXTERIOR background is flood-filled to real transparency from the image
 *        border, so the lockup also sits clean on lifted `surface` panels (footer) and
 *        over photos. Keying black edges risks halos on LIGHT backgrounds — but every
 *        surface this mark lands on is near-black, where a dark fringe is invisible.
 *        The fill only walks in from the border, so the black INSIDE the diamond stays.
 *
 * Outputs (public/photos/):
 *   logo-just-junk-it.webp    trimmed lockup, TRANSPARENT exterior, 640px tall
 *                             (2x for display sizes up to ~320px: header, hero, footer)
 *   logo-just-junk-it-og.png  1200x630 Open Graph card, logo on the sampled black.
 *                             PNG on purpose: link-preview scrapers (iMessage, Facebook,
 *                             Slack) have patchy WebP/AVIF support, and a flat-colour
 *                             graphic compresses small as PNG anyway.
 */
import { statSync } from "node:fs";
import sharp from "sharp";

const SRC = "Trystan Photos/6C81F79C-C443-4168-AB24-651B4D22ED6A.PNG";

const kb = (f) => `${(statSync(f).size / 1024).toFixed(0)} KB`;
const hex = (r, g, b) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

// ---- 1. Sample the actual background black from the border pixels -------------------
// Mode (most common value) of the border ring, not an average — an average would be
// dragged around by the handful of border pixels the art touches.
const srcImg = sharp(SRC);
const meta = await srcImg.metadata();
const { data, info } = await srcImg.raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const px = (x, y) => {
  const i = (y * W + x) * C;
  return [data[i], data[i + 1], data[i + 2]];
};
const counts = new Map();
for (let x = 0; x < W; x++) {
  for (const y of [0, H - 1]) {
    const k = px(x, y).join(",");
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
}
for (let y = 0; y < H; y++) {
  for (const x of [0, W - 1]) {
    const k = px(x, y).join(",");
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
}
const [bgKey] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
const [bgR, bgG, bgB] = bgKey.split(",").map(Number);
console.log(`SAMPLED LOGO BACKGROUND: ${hex(bgR, bgG, bgB)}  (rgb ${bgKey}, mode of ${meta.width}x${meta.height} border ring)`);
console.log(`  -> this exact value is the site's \`ink\` token in tailwind.config.ts`);

// ---- 2. Flood-fill the EXTERIOR background to transparent ---------------------------
// BFS from every border pixel across near-background pixels (tolerance covers the ±1
// sensor noise). Interior blacks — the diamond's own field — are unreachable from the
// border and stay opaque.
const TOL = 16;
const near = (x, y) => {
  const [r, g, b] = px(x, y);
  return Math.abs(r - bgR) <= TOL && Math.abs(g - bgG) <= TOL && Math.abs(b - bgB) <= TOL;
};
const outside = new Uint8Array(W * H);
const queue = [];
for (let x = 0; x < W; x++) for (const y of [0, H - 1]) if (near(x, y)) queue.push(y * W + x);
for (let y = 0; y < H; y++) for (const x of [0, W - 1]) if (near(x, y)) queue.push(y * W + x);
while (queue.length) {
  const i = queue.pop();
  if (outside[i]) continue;
  const x = i % W, y = (i / W) | 0;
  if (!near(x, y)) continue;
  outside[i] = 1;
  if (x > 0) queue.push(i - 1);
  if (x < W - 1) queue.push(i + 1);
  if (y > 0) queue.push(i - W);
  if (y < H - 1) queue.push(i + W);
}
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  rgba[i * 4] = data[i * C];
  rgba[i * 4 + 1] = data[i * C + 1];
  rgba[i * 4 + 2] = data[i * C + 2];
  rgba[i * 4 + 3] = outside[i] ? 0 : 255;
}
const keyedFrac = [...outside].reduce((n, v) => n + v, 0) / (W * H);
console.log(`keyed exterior: ${(keyedFrac * 100).toFixed(1)}% of frame -> alpha 0`);

const transparent = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });

// Trim the now-transparent margin so the diamond fills its box.
const trimmed = await transparent.trim().png().toBuffer();
const tm = await sharp(trimmed).metadata();
console.log(`trimmed: ${W}x${H} -> ${tm.width}x${tm.height}`);

// ---- 3. Site asset — transparent WebP, 2x of the largest display slot ---------------
// Near-lossless: it is a flat graphic; photo-grade quality would smear the lettering.
const header = "public/photos/logo-just-junk-it.webp";
await sharp(trimmed).resize({ height: 512 }).webp({ quality: 85, effort: 6 }).toFile(header);
const hm = await sharp(header).metadata();
console.log(`${header}  ${hm.width}x${hm.height}  ${kb(header)}  (alpha: ${hm.hasAlpha})`);

// ---- 4. OG card — logo centred on the SAMPLED black, standard 1200x630 --------------
const og = "public/photos/logo-just-junk-it-og.png";
const inner = await sharp(trimmed).resize({ width: 1040, height: 540, fit: "inside" }).toBuffer();
const im = await sharp(inner).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: bgR, g: bgG, b: bgB } } })
  .composite([{ input: inner, left: Math.round((1200 - im.width) / 2), top: Math.round((630 - im.height) / 2) }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(og);
console.log(`${og}  1200x630  ${kb(og)}`);
