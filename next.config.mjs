/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Custom loader, NOT the Next image optimizer. It only picks between two files the
    // photo pipeline generated ahead of time, so the built site carries zero runtime
    // image-optimizer dependency and every page stays fully static.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [800, 1600],
    // 800 repeats deviceSizes on purpose: Next would otherwise emit a "384w" descriptor
    // pointing at the 800px file, which is a false width claim.
    imageSizes: [800],
  },
};

export default nextConfig;
