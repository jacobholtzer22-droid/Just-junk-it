import type { Metadata, Viewport } from "next";
import { Anton, Barlow } from "next/font/google";
import "./globals.css";

/**
 * GO-LIVE GUARD — do not remove this import, and do not move it below the others.
 *
 * lib/require-live-config.ts throws at module scope when site.config.ts still has an
 * empty crm.businessSlug and NEXT_PUBLIC_DEMO_MODE is not 'true'. The root layout is
 * evaluated for every route during `next build`, so importing it here means the check
 * always runs and cannot be tree-shaken out. This is what makes shipping the demo
 * configuration to a real domain physically impossible.
 */
import "@/lib/require-live-config";

import { site } from "@/site.config";
import Analytics from "@/components/Analytics";
import MobileCtaBar from "@/components/MobileCtaBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DemoCanary from "@/components/DemoCanary";
import JsonLd from "@/components/JsonLd";
import { localBusinessSchema, websiteSchema, organizationSchema } from "@/lib/schema";

/** Condensed and heavy — meant to read like it was stencilled on the side of a trailer. */
const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/**
 * Barlow ships ONLY the weights the site uses: 400 for body copy and 600 for the one
 * form-error style. 500 and 700 were preloaded on every page and used nowhere — five
 * preloaded font files were competing with the LCP element, which is the H1 text.
 * Every unused weight is a preload, a round trip and a delay to the largest paint.
 * Add a weight here only when something actually renders in it.
 */
const body = Barlow({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: site.seo.pages.home.title,
  description: site.seo.pages.home.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zoom is never disabled.
  themeColor: "#0B0B0C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="page-shell">
        <Header />
        {children}
        <Footer />
        <MobileCtaBar />
        <Analytics />
        {/* Logs a console error if a demo build ever serves on a non-vercel.app host. */}
        <DemoCanary />
        {/* Sitewide. Every claim here is also printed in the footer on every page. */}
        <JsonLd data={localBusinessSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
