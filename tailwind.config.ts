import type { Config } from "tailwindcss";

/**
 * Heavy industrial, Northern Minnesota. Near-black base, ONE accent.
 *
 * ACCENT: the LOGO RED (Aug 2026 — Jacob supplied Trystan's actual logo: black field,
 * dark-red banner with white lettering, red diamond border). The earlier safety yellow
 * is gone; the site now matches the brand mark.
 *
 * WHICH red, and why this exact hex: the logo carries two reds. The deep banner red
 * (~#8E1215) measures 2.11:1 on our near-black — unusable for anything. #C1272D matches
 * the logo's brighter border red and measures, verified by calculation:
 *   3.37:1 on ink   -> passes for icons, borders, and LARGE display text only
 *   5.13:1 under paper text -> passes for button labels
 * The consequences are load-bearing rules, not suggestions:
 *   - Buttons are red FILLS with PAPER text — same as the logo banner itself. Never put
 *     ink text on an accent fill (3.37:1, fails).
 *   - Small accent-coloured text is FORBIDDEN. Small emphasis is paper, not red.
 *   - danger is AMBER, not a second red — an error must not look like a CTA.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // THE SAMPLED LOGO BLACK — not an aesthetic choice. scripts/process-logo.mjs
        // measures the logo file's background (mode of its border ring) and prints this
        // value on every run; the token must match it exactly so the mark merges with
        // the page instead of sitting in a box. Was #0B0B0C, which was 11 levels lighter
        // than the logo field and visibly boxed it. If the logo file ever changes,
        // re-run the script and move this token to whatever it prints.
        ink: "#010000", // page base = sampled logo black
        surface: "#141416", // lifted panels, form background
        paper: "#F2F0EB", // primary text, warm off-white
        accent: "#C1272D", // logo red — fills w/ paper text, icons, LARGE type only
        danger: "#FFB020", // errors only — amber, >10:1 on ink, cannot be mistaken for the red CTAs
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
