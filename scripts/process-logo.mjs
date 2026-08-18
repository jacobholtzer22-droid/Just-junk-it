/**
 * Logo pipeline — one-off but reproducible.  Run:  node scripts/process-logo.mjs
 *
 * Source: the PNG Jacob dropped into "Trystan Photos/" (camera-roll filename). It is
 * 1536x1024 RGB, background effectively pure black (1,0,0) with no alpha. That black is
 * visually identical to the site's ink #0B0B0C, so no transparency keying is attempted —
 * keying antialiased edges out of black is how logos get halos.
 *
 * Outputs (public/photos/):
 *   logo-just-junk-it.webp    trimmed lockup, 320px tall (2x for a ~56-64px header slot)
 *   logo-just-junk-it-og.png  1200x630 Open Graph card, logo centred on black.
 *                             PNG on purpose: link-preview scrapers (iMessage, Facebook,
 *                             Slack) have patchy WebP/AVIF support, and a flat-colour
 *                             graphic compresses small as PNG anyway.
 */
import { statSync } from "node:fs";
import sharp from "sharp";

const SRC = "Trystan Photos/6C81F79C-C443-4168-AB24-651B4D22ED6A.PNG";

const kb = (f) => `${(statSync(f).size / 1024).toFixed(0)} KB`;

// Trim the uniform black margin so the diamond fills its box.
const trimmed = await sharp(SRC).trim({ threshold: 12 }).toBuffer();
const tm = await sharp(trimmed).metadata();
console.log(`trimmed: 1536x1024 -> ${tm.width}x${tm.height}`);

// Header asset — 2x of the largest display size, near-lossless (it is a flat graphic;
// photo-grade quality settings would smear the lettering edges).
const header = "public/photos/logo-just-junk-it.webp";
await sharp(trimmed).resize({ height: 320 }).webp({ quality: 90, effort: 6 }).toFile(header);
const hm = await sharp(header).metadata();
console.log(`${header}  ${hm.width}x${hm.height}  ${kb(header)}`);

// OG card — logo centred on black, standard 1200x630.
const og = "public/photos/logo-just-junk-it-og.png";
const inner = await sharp(trimmed).resize({ width: 1040, height: 540, fit: "inside" }).toBuffer();
const im = await sharp(inner).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: { r: 1, g: 0, b: 0 } } })
  .composite([{ input: inner, left: Math.round((1200 - im.width) / 2), top: Math.round((630 - im.height) / 2) }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(og);
console.log(`${og}  1200x630  ${kb(og)}`);
