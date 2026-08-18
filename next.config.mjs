/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * NO `images` BLOCK ON PURPOSE.
   *
   * This site does not use next/image. All photography goes through components/Photo.tsx,
   * which emits a plain <picture> with pre-generated AVIF and WebP sources and lets the
   * browser negotiate the format natively.
   *
   * The previous custom `loader` config and lib/image-loader.ts were deleted with that
   * change: with no next/image call sites they configured nothing, and dead config that
   * implies behaviour which is not happening is worse than no config. For the same reason
   * `formats: ['image/avif','image/webp']` is absent — that key only drives Next's built-in
   * optimizer, which this site deliberately does not run.
   */
};

export default nextConfig;
