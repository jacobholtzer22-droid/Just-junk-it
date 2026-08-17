import type { Config } from "tailwindcss";

/**
 * Heavy industrial, Northern Minnesota. Near-black base, ONE high-visibility accent.
 *
 * ACCENT: safety yellow, and only safety yellow. Hazard orange was the alternative and
 * was rejected on contrast — #FFD400 on #0B0B0C measures ~15.9:1, while a comparable
 * hazard orange lands near 6:1. With an accent this load-bearing (every CTA, every tap
 * target, on a phone, outdoors) the yellow is the one that stays legible.
 *
 * The accent is for CTAs and almost nothing else. If you are reaching for it to decorate
 * something, don't — the point is that the eye always knows where to tap.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C", // page base, near-black
        surface: "#141416", // lifted panels, form background
        paper: "#F2F0EB", // primary text, warm off-white
        accent: "#FFD400", // safety yellow — CTAs only
        danger: "#FF6B4A", // errors only. 6.6:1 on ink
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      // Aggressive scale. Headline sizes that feel one notch too big on a phone are
      // correct here — see the art direction in the build brief.
      fontSize: {
        "display-sm": ["2.75rem", { lineHeight: "0.92", letterSpacing: "-0.01em" }],
        "display-md": ["3.75rem", { lineHeight: "0.90", letterSpacing: "-0.015em" }],
        "display-lg": ["5rem", { lineHeight: "0.88", letterSpacing: "-0.02em" }],
        "display-xl": ["7rem", { lineHeight: "0.86", letterSpacing: "-0.025em" }],
      },
    },
  },
  plugins: [],
};

export default config;
