/**
 * Custom next/image loader. Does NOT optimize at runtime — it only picks between two
 * files the photo pipeline generated ahead of time:
 *
 *   /photos/foo.webp       long edge 1600
 *   /photos/foo-800.webp   long edge 800
 *
 * next/image builds the srcset from these, so a phone downloads the 800w file and a
 * desktop the 1600w, with no runtime image-optimizer dependency and no layout shift.
 * Anything outside /photos passes through untouched.
 */
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.startsWith("/photos/") || !src.endsWith(".webp")) return src;
  if (src.endsWith("-800.webp")) return src;
  return width <= 800 ? src.replace(/\.webp$/, "-800.webp") : src;
}
