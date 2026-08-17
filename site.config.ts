import {
  Sofa,
  WashingMachine,
  Home,
  Warehouse,
  Leaf,
  HardHat,
  Waves,
  Trash2,
  type LucideIcon,
} from "lucide-react";

/**
 * site.config.ts — SINGLE SOURCE OF TRUTH for Just Junk It.
 *
 * STANDING RULES
 *   1. Never add a business fact that has not been confirmed by Jacob or by Trystan.
 *      No prices, no years in business, no crew size, no review counts, no star ratings,
 *      no job counts, no truck capacity, no licensing or insurance claims.
 *   2. No fabricated urgency or guarantees. "Same day service available" is confirmed
 *      and allowed. "Same day guaranteed", "lowest price", "satisfaction guaranteed"
 *      are NOT, and must never appear.
 *   3. Anything wanted but unconfirmed stays a TODO here and never becomes a claim
 *      on the page. Unconfirmed items are listed in HANDOFF.md.
 *
 * DEMO MODE — read lib/require-live-config.ts before touching `crm.businessSlug`.
 *   This site currently ships as a DEMO for Trystan. There is no Neon Business row yet,
 *   so `crm.businessSlug` is deliberately an empty string and the form does not POST.
 *   A build-time guard makes it impossible to ship this state to production by accident.
 *   The three-step go-live swap is at the top of HANDOFF.md.
 */

export type SiteImage = {
  /** Path under /public. Empty string renders a labeled placeholder, never a stock photo. */
  src: string;
  alt: string;
  placeholderLabel?: string;
};

export type Service = {
  title: string;
  slug: string;
  /** One line, used on cards and in the services grid. */
  blurb: string;
  icon: LucideIcon;
  /** Hand written, measured to 50-60 chars RENDERED. Not templated — a single template
   *  cannot hit the window for both "Junk Removal" and "Construction Debris Removal". */
  metaTitle: string;
  /** Hand written, measured to 140-160 chars rendered. */
  metaDescription: string;
  /** Opening paragraph. Answers who / what / where in two sentences. No slogan fluff. */
  intro: string;
  /** Concrete and specific to THIS service. Never a generic junk list. */
  covers: string[];
  whenYouNeedIt: string[];
  image: SiteImage;
  /** FAQ ids (from `faqs` below) rendered visibly on this page. The FAQPage schema is
   *  built from exactly this list — never a superset. */
  faqIds: string[];
  /** Slugs of 2-3 related services, for the internal link block. */
  related: string[];
};

export type Faq = { id: string; q: string; a: string };

/**
 * E.164 throughout. The build prompt wrote the sticky-bar hrefs as `tel:2182561340`;
 * this uses `tel:+12182561340` instead, matching the reference repo's house pattern.
 * Bare 10-digit works on US handsets but E.164 is unambiguous everywhere and is what
 * the platform's other client sites emit. Flagged to Jacob — one-line change if he
 * wants the bare form back.
 */
const PHONE_DIGITS = "12182561340";
const PHONE_DISPLAY = "(218) 256-1340";

const GEO_LEAD = "Grand Rapids";
const GEO_REGION = "Itasca County";

export const site = {
  business: {
    name: "Just Junk It",
    shortName: "Just Junk It",
    /** Owner goes by first name on the site — he is the guy who shows up. */
    ownerFirstName: "Trystan",
    /** Service-area business. NO street address is published, on the page or in schema. */
    city: GEO_LEAD,
    state: "MN",
    /** Used for the postal region in copy only, never as a street address. */
    zip: "55744",
    phoneDisplay: PHONE_DISPLAY,
    phoneHref: `tel:+${PHONE_DIGITS}`,
    smsHref: `sms:+${PHONE_DIGITS}`,
    email: "justjunkit218@gmail.com",
    /** Confirmed: Monday through Saturday, 7am to 7pm. Closed Sunday. */
    hours: {
      display: "Mon–Sat, 7am–7pm",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:00",
      closes: "19:00",
    },
    /** His brand asset, verbatim. Do not rewrite, reword or re-punctuate. */
    tagline: "We Don't Talk Trash — We Remove It",
    /** TODO: no logo file supplied. Empty src renders a wordmark, never a placeholder box. */
    logo: {
      src: "",
      alt: "Just Junk It logo",
    } as SiteImage,
    /** Real profiles only. Empty entries are never rendered and never enter sameAs. */
    social: {
      facebook: "https://www.facebook.com/JustJunkIt218",
      instagram: "https://www.instagram.com/justjunkit218",
      /** TODO: Google Business Profile URL from Trystan. */
      google: "",
    },
  },

  geo: {
    lead: GEO_LEAD,
    region: GEO_REGION,
    counties: [GEO_REGION],
    /** Named by Trystan. Do not add towns he did not name. */
    cities: [
      "Grand Rapids",
      "Pokegama Lake",
      "Cohasset",
      "Coleraine",
      "Bovey",
      "Marble",
      "Hill City",
      "Pengilly",
      "Taconite",
      "Bigfork",
      "Deer River",
      "Remer",
      "Nashwauk",
    ],
  },

  cta: {
    callLabel: "Call",
    textLabel: "Text",
    quoteLabel: "Get a Free Quote",
    quoteHref: "/contact",
    bandHeading: "Point at it. We'll load it.",
    bandBody:
      "Call or text and talk to Trystan, the guy who actually shows up. Tell him what you have and where it is, and you get a straight answer.",
  },

  hero: {
    /** H1. Names the service and the city. */
    h1: `Junk Removal in ${GEO_LEAD}, MN`,
    sub: "You point. We load. It's gone. Junk removal and hauling across Itasca County, run by the guy who shows up.",
    image: {
      src: "/photos/truck-01-dump-trailer.webp",
      alt: "",
      placeholderLabel: "Truck and dump trailer",
    } as SiteImage,
  },

  /** Three-second trust strip. Nothing here may be a claim we cannot back. */
  trust: [
    {
      label: "Same day service available",
      note: "Call early and there is a good chance it goes today",
    },
    { label: "Free quotes", note: "Tell us what you have, get a straight number" },
    { label: "Locally owned", note: `Based in ${GEO_LEAD}, working across ${GEO_REGION}` },
  ],

  /**
   * TODO — BLOCKED, see HANDOFF.md.
   * The build prompt calls for "the five points from his current site". His current site
   * was never supplied. This array stays empty and the "Why Just Junk It" section does
   * not render until Jacob pastes the real five. Nothing invented to fill the hole.
   */
  whyUs: [] as { heading: string; body: string }[],

  howItWorks: [
    {
      step: "1",
      heading: "Call or text",
      body: `Reach ${PHONE_DISPLAY} directly. Tell us what you have and where it is.`,
    },
    {
      step: "2",
      heading: "You point, we load",
      body: "You do not lift anything, move anything, or drag anything to the curb. Show us the pile.",
    },
    {
      step: "3",
      heading: "It's gone",
      body: "We haul it out, sweep up behind us, and you get your space back.",
    },
  ],

  /**
   * Eight services, one page each. Copy is unique per page — no template filling.
   * `image.src` empty means no honest photo exists for that service yet; the page
   * renders a full-bleed type treatment in that slot instead of stock imagery.
   * See seo/PHOTO-INVENTORY.md §4 for the coverage gap.
   */
  services: [] as Service[],

  faqs: [] as Faq[],

  gallery: {
    heading: "Before and after",
    body: "Every photo on this page is a real job in Itasca County. No stock, no staging.",
  },

  serviceArea: {
    heading: `Serving ${GEO_REGION} and the surrounding area`,
    body: `Based in ${GEO_LEAD} and working across ${GEO_REGION}. If your town is not on this list, call anyway — if it is close, we will tell you straight.`,
  },

  contact: {
    heading: "Get a free quote",
    body: "Call or text for the fastest answer, or send this and you will get a call back.",
    successHeading: "Got it.",
    successBody:
      "Your request came through. Expect a call back at the number you gave us. If you need an answer right now, call and you will get a person.",
    consentLabel:
      "Text me about this request. Message and data rates may apply, and you can reply STOP at any time to opt out.",
    errorLead: "That did not send. Call or text us instead at",
    form: {
      nameLabel: "Name",
      namePlaceholder: "Your name",
      phoneLabel: "Phone",
      phonePlaceholder: PHONE_DISPLAY,
      emailLabel: "Email",
      emailOptionalLabel: "(optional)",
      emailPlaceholder: "you@example.com",
      addressLabel: "Address or town",
      addressOptionalLabel: "(optional)",
      addressPlaceholder: "Where is the job?",
      messageLabel: "What needs to go?",
      messagePlaceholder:
        "A rough description is fine. Example: garage cleanout, about a pickup load, plus an old fridge.",
      submitLabel: "Send my request",
      submittingLabel: "Sending",
    },
  },

  crm: {
    url: "https://www.alignandacquire.com/api/contact",
    /**
     * DEMO BUILD — intentionally empty. There is no Neon Business row for Just Junk It yet.
     *
     * Empty string means:
     *   - the form validates, honeypots, requires consent, shows loading and success,
     *     and does NOT POST (see components/ContactForm.tsx)
     *   - `next build` FAILS unless NEXT_PUBLIC_DEMO_MODE=true
     *     (see lib/require-live-config.ts)
     *
     * GO LIVE: create the Neon Business row, paste its verbatim slug here, then delete
     * the NEXT_PUBLIC_DEMO_MODE env var. The live POST is already written and takes
     * effect the moment this string is non-empty. No code change, no rebuild of logic.
     *
     * The endpoint returns HTTP 200 even when businessSlug matches no Business row, so a
     * WRONG slug is silent lead loss and a green success message proves nothing. Verify
     * against the live Neon row and send one real test submission.
     */
    businessSlug: "",
  },

  ads: {
    /**
     * Blank until the Ads account exists. Unlike the CRM slug this does NOT fail the
     * build — ads legitimately come after launch. Events are wired and inert.
     * Config bakes in at BUILD time: after filling these, redeploy WITHOUT build cache.
     */
    tagId: "",
    conversions: {
      /** Quote-form submission. */
      contact: "",
      /** Tap on any tel: link. */
      call: "",
      /** Tap on any sms: link. */
      text: "",
    },
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/junk-removal" },
    { label: "Gallery", href: "/gallery" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "Contact", href: "/contact" },
  ],

  footer: {
    tagline: "Junk removal and hauling across Itasca County, Minnesota.",
    builtBy: "Site by Align and Acquire",
    builtByHref: "https://www.alignandacquire.com",
  },

  seo: {
    /** Canonical host is www. The apex 308-redirects to it at the platform level. */
    url: "https://www.justjunkitmn.com",
    siteName: "Just Junk It",
    pages: {
      home: {
        path: "/",
        title: `Junk Removal in ${GEO_LEAD}, MN | Just Junk It`,
        description: `Junk removal and hauling in ${GEO_LEAD} and across ${GEO_REGION}. You point, we load, it's gone. Same day service available. Call or text ${PHONE_DISPLAY}.`,
      },
      gallery: {
        path: "/gallery",
        title: `Junk Removal Before & After Photos | ${GEO_LEAD} MN`,
        description: `Real before and after photos from junk removal and cleanout jobs across ${GEO_REGION}, Minnesota. Every photo on this page is from an actual job.`,
      },
      contact: {
        path: "/contact",
        title: `Get a Free Junk Removal Quote | ${GEO_LEAD}, MN`,
        description: `Request a free quote for junk removal or hauling in ${GEO_LEAD} and ${GEO_REGION}. Call or text ${PHONE_DISPLAY}, or send the form and get a call back.`,
      },
      serviceAreas: {
        path: "/service-areas",
        title: `Junk Removal Service Area | ${GEO_REGION}, MN`,
        description: `Just Junk It covers ${GEO_LEAD}, Cohasset, Coleraine, Bovey, Deer River, Bigfork, Nashwauk and the rest of ${GEO_REGION}, Minnesota. Call or text for a free quote.`,
      },
      privacy: {
        path: "/privacy",
        title: "Privacy Policy | Just Junk It",
        description:
          "How Just Junk It handles the information you submit through this website, including phone numbers given for text message follow-up.",
      },
    },
  },
} as const;

export type Site = typeof site;
