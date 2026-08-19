import {
  Sofa,
  WashingMachine,
  Home,
  Warehouse,
  Leaf,
  HardHat,
  Waves,
  Trash2,
  Snowflake,
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
 * LIVE MODE (Aug 2026) — read lib/require-live-config.ts before touching `crm.businessSlug`.
 *   The Neon Business row exists; `crm.businessSlug` carries its verbatim slug and the
 *   quote form POSTs for real. The build-time guard STAYS: it still fails the build on an
 *   empty slug, and on a slug set while a stale NEXT_PUBLIC_DEMO_MODE=true is present.
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
  /**
   * Everything below is PAGE-LEVEL copy, written per service in Gate B. Optional only
   * because the homepage grid ships first and needs title/slug/blurb/icon alone. When a
   * service page is written these stop being optional in practice — the page will not
   * render without them.
   */
  /** Hand written, measured to 50-60 chars RENDERED. Not templated — a single template
   *  cannot hit the window for both "Junk Removal" and "Construction Debris Removal". */
  metaTitle?: string;
  /** Hand written, measured to 140-160 chars rendered. */
  metaDescription?: string;
  /** Opening paragraph. Answers who / what / where in two sentences. No slogan fluff. */
  intro?: string;
  /** Concrete and specific to THIS service. Never a generic junk list. */
  covers?: string[];
  whenYouNeedIt?: string[];
  image?: SiteImage;
  /** FAQ ids (from `faqs` below) rendered visibly on this page. The FAQPage schema is
   *  built from exactly this list — never a superset. */
  faqIds?: string[];
  /** Slugs of 2-3 related services, for the internal link block. */
  related?: string[];
  /**
   * Key into lib/photo-manifest.ts. Where a service has no job photo of its own this
   * points at a real asset described as exactly what it is (the truck) — never stock,
   * never a photo relabelled as work it does not show. Those are marked TODO PHOTO.
   */
  photoKey?: string;
};

export type Faq = { id: string; q: string; a: string };

export type Review = {
  /** The reviewer's name EXACTLY as it appears on the source platform. */
  author: string;
  /** The review text VERBATIM. Never tidied, never shortened, never paraphrased. */
  body: string;
  /** Where it was left. Shown to the reader so the claim is checkable. */
  source: "Google" | "Facebook";
  /** ISO date the review was left, if known. Display only. */
  date?: string;
  /**
   * Confirmed by Jacob: every review is 5 stars. Displayed as stars for humans.
   * ⚠ This NEVER becomes Review or AggregateRating schema — see the note on `reviews`.
   */
  rating?: 5;
  /** Service slugs this review is evidence for, so service pages can show a relevant one. */
  services?: string[];
};

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

  /**
   * TWO DIVISIONS. `/` is a chooser; each division has its own home page.
   *
   * SNOW REMOVAL WENT LIVE AUG 2026 on Jacob's instruction, on exactly these confirmed
   * facts and NOTHING more: it is offered, this is the FIRST SEASON, the service area is
   * the same Itasca County towns as junk, and quotes are free. Everything operational —
   * plow vs shovel vs blow, salting, contracts, per-inch triggers, response times,
   * commercial work, equipment — is still UNCONFIRMED and must not appear anywhere.
   * The open questions live in HANDOFF.md → CLIENT QUESTIONS.
   *
   * The snow photography is STOCK (Pexels, scene-only, no crews or equipment) because
   * the first season has no job photos yet. Sources + swap list: HANDOFF.md → SWAP
   * AFTER FIRST SNOW. Stock never enters /gallery.
   */
  divisions: [
    {
      key: "junk",
      title: "Junk Removal",
      tagline: "You point. We load. It's gone.",
      href: "/junk-removal",
      photoKey: "job-03-carport-packed-full",
      available: "Year round",
    },
    {
      key: "snow",
      title: "Snow Removal",
      tagline: "Northern Minnesota winters, handled.",
      href: "/snow-removal",
      // STOCK (Pexels) until real winter photos exist — swap after first snow.
      photoKey: "stock-snow-03-snowfall-street",
      available: "Winter season",
    },
  ],

  snow: {
    h1: `Snow Removal in ${GEO_LEAD}, MN`,
    sub: `Snow removal across ${GEO_REGION}, run by the same person who answers the phone.`,
    /**
     * Every sentence here is grounded in a confirmed fact: first season (confirmed by
     * Jacob), same owner and phone, year-round junk operation, free quotes, same towns.
     * No equipment, scope, trigger-depth or turnaround claims — those are unconfirmed.
     */
    firstSeason: {
      heading: "New this winter, not new to showing up",
      body: [
        "This is the first winter Just Junk It is taking on snow. We would rather tell you that straight than pretend to be something we are not — what you get is the same locally owned outfit that hauls junk across Itasca County all year, pointed at your snow.",
        "You call the same number and you get Trystan, the person who actually does the work. Tell him where you are and what needs clearing, and you get a straight answer and a free quote — before anything gets cleared.",
      ],
    },
    howItWorks: [
      {
        step: "1",
        heading: "Call or text",
        body: `Reach ${PHONE_DISPLAY} directly, Monday through Saturday, 7am to 7pm.`,
      },
      {
        step: "2",
        heading: "Tell us what needs clearing",
        body: "Where you are and what the snow is sitting on. A rough description is fine.",
      },
      {
        step: "3",
        heading: "Get a straight answer",
        body: "A free quote and a clear yes or no on whether we can get to you.",
      },
    ],
    /** FAQ ids from `snowFaqs` below, rendered visibly and mirrored EXACTLY into schema. */
    faqIds: ["snow-first-season", "snow-areas", "snow-cost", "snow-hours"],
    /** Junk-side services cross-linked at the bottom of the snow page. */
    related: ["yard-waste-removal", "garage-cleanouts", "junk-removal"],
  },

  /**
   * Snow-page FAQs. SEPARATE from `faqs` on purpose: the junk home page renders the whole
   * `faqs` array, so snow questions in that array would leak onto the junk page. The
   * FAQPage schema on /snow-removal is built from EXACTLY this list.
   * Grounded facts only — first season, towns, free quotes, hours. Nothing operational.
   */
  snowFaqs: [
    {
      id: "snow-first-season",
      q: "Is this your first season doing snow?",
      a: "Yes, and we would rather say so than pretend otherwise. Just Junk It has hauled junk across Grand Rapids and Itasca County year round — snow is the winter side of the same locally owned business. You call the same number and deal with the same person.",
    },
    {
      id: "snow-areas",
      q: "Where do you clear snow?",
      a: "The same area as the junk side: Grand Rapids and the surrounding Itasca County towns, including Cohasset, Coleraine, Bovey, Deer River, Nashwauk and Pokegama Lake. If your town is not on the list, call anyway and you will get a straight answer.",
    },
    {
      id: "snow-cost",
      q: "What does snow removal cost?",
      a: "Quotes are free. Tell us where you are and what needs clearing, and you get a clear number before any work starts.",
    },
    {
      id: "snow-hours",
      q: "When can I reach you?",
      a: "Monday through Saturday, 7am to 7pm. Call or text 218-256-1340 during those hours and you will reach Trystan directly.",
    },
  ] as Faq[],

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
    /**
     * Key into lib/photo-manifest.ts. Alt text lives there with the verified copy, so a
     * page cannot quietly re-describe a photo as something it does not show.
     */
    photoKey: "truck-01-dump-trailer-grand-rapids",
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
   * VERBATIM from Trystan's current site, supplied by Jacob. Do not rewrite, reorder,
   * reword or add a sixth. These are his own claims carried over, not marketing copy
   * written by us.
   *
   * ⚠ Point 2 is a PRICING COMMITMENT, not a marketing line. "What we quote is what you
   * pay" is an operational promise the business has to keep. It is on the owner sign-off
   * list in HANDOFF.md for exactly that reason.
   *
   * Points 1 and 3 are both hedged in his original wording ("when we can"). The hedge is
   * load-bearing — it is the difference between "same day available" and a guarantee, and
   * between "we recycle" and an environmental claim we cannot substantiate. Keep it.
   */
  whyUs: [
    {
      heading: "Same Day Service Available",
      // ⚠ "when we can" is LOAD-BEARING. It is the difference between advertising
      // availability and making a guarantee we cannot keep. Do not tighten this line.
      body: "Need it gone today? Call us. We make it happen when we can.",
    },
    {
      heading: "Upfront Pricing, No Surprises",
      // ⚠ PRICING COMMITMENT, not a marketing line. This promises no upcharge after a
      // quote is given. Carried over verbatim from Trystan's own site; on the owner
      // sign-off list in HANDOFF.md. Do not restate it more strongly.
      body: "You get a clear quote before we start. What we quote is what you pay.",
    },
    {
      heading: "We Recycle & Donate When Possible",
      // ⚠ "when we can" is LOAD-BEARING. Without it this becomes an environmental claim
      // we cannot substantiate. Do not tighten this line.
      body: "Good stuff doesn't always go to the dump. We keep it out of landfills when we can.",
    },
    {
      heading: "Locally Owned, Grand Rapids MN",
      body: "We're your neighbors. We care about doing the job right every time.",
    },
    {
      heading: "No Job Too Big or Too Small",
      body: "Single item pickup or full property cleanout, we handle both.",
    },
  ] as { heading: string; body: string }[],

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
  /**
   * The eight services. Order is the order they appear in the homepage grid and the nav.
   *
   * Gate A ships title/slug/blurb/icon only. Page copy, meta and FAQ mappings are written
   * per service in Gate B — no template filling, because a template cannot write an honest
   * "what we take" list for both a hot tub and a bag of yard waste.
   *
   * `photoKey` is the honest-asset rule: where a service has no job photo of its own, the
   * page falls back to a real asset described as exactly what it is (the truck), never a
   * stock image and never a photo relabelled as work it does not show.
   */
  services: [
    {
      // Its slug IS the junk division home page — the grid card links there rather than
      // to a duplicate page competing for the same query.
      title: "General Junk Hauling",
      slug: "junk-removal",
      blurb: "One item or a whole property. You point at it, we carry it out.",
      icon: Trash2,
      photoKey: "job-03-carport-packed-full",
    },
    {
      title: "Furniture Removal",
      slug: "furniture-removal",
      blurb: "Couches, mattresses, recliners, desks. Out of the room, not just the curb.",
      icon: Sofa,
      photoKey: "before-02-basement-estate-cleanout",
      metaTitle: "Furniture Removal in Grand Rapids, MN | Just Junk It",
      metaDescription: "Furniture removal in Grand Rapids and across Itasca County, MN. Couches, mattresses, recliners and desks carried out of the room. Call or text (218) 256-1340.",
      intro: "Just Junk It removes furniture from homes, apartments and rentals in Grand Rapids and across Itasca County. We carry it out of the room it is sitting in \u2014 down stairs, through doorways, out of a basement \u2014 so you are not dragging a couch to the curb yourself.",
      covers: [
        "Couches, sectionals and loveseats",
        "Mattresses and box springs",
        "Recliners and armchairs",
        "Dressers, wardrobes and headboards",
        "Desks, filing cabinets and office chairs",
        "Dining sets and coffee tables",
        "Entertainment centres and bookcases",
        "Patio and deck furniture"
      ],
      whenYouNeedIt: [
        "New furniture is arriving and the old set has to be gone first",
        "Clearing a rental between tenants",
        "A mattress that will not fit in any vehicle you own",
        "Downsizing and the pieces are too big to sell"
      ],
      faqIds: ["move-it", "cost", "same-day", "areas"],
      related: ["estate-cleanouts", "appliance-removal", "junk-removal"],
    },
    {
      title: "Appliance Removal",
      slug: "appliance-removal",
      blurb: "Fridges, washers, dryers, water heaters. Disconnected and hauled.",
      icon: WashingMachine,
      photoKey: "job-02-basement-appliances",
      metaTitle: "Appliance Removal in Grand Rapids, MN | Just Junk It",
      metaDescription: "Appliance removal in Grand Rapids and Itasca County, MN. Fridges, washers, dryers and water heaters disconnected and hauled away. Call or text (218) 256-1340.",
      intro: "Just Junk It hauls old appliances out of homes across Grand Rapids and Itasca County. Appliances are heavy, awkward and usually sitting in a basement or a tight laundry room, which is exactly the kind of job people put off for months.",
      covers: [
        "Refrigerators and chest freezers",
        "Washers and dryers",
        "Stoves, ovens and cooktops",
        "Dishwashers",
        "Water heaters",
        "Microwaves and small kitchen appliances",
        "Air conditioners and dehumidifiers",
        "Furnaces and boilers being replaced"
      ],
      whenYouNeedIt: [
        "A replacement is being delivered and the old unit has to go",
        "A basement laundry pair that has not moved in twenty years",
        "An appliance that died and is now just taking up the room",
        "Clearing a property before it goes on the market"
      ],
      faqIds: ["move-it", "cost", "areas", "what-we-take"],
      related: ["furniture-removal", "estate-cleanouts", "junk-removal"],
    },
    {
      title: "Estate Cleanouts",
      slug: "estate-cleanouts",
      blurb: "Whole-house clearing, handled quietly and without rushing you.",
      icon: Home,
      photoKey: "after-02-basement-estate-cleanout",
      metaTitle: "Estate Cleanouts in Grand Rapids, MN | Just Junk It",
      metaDescription: "Estate cleanouts in Grand Rapids and Itasca County, MN. Whole-house clearing handled quietly and at your pace. Call or text (218) 256-1340 for a free quote.",
      intro: "Just Junk It handles estate and whole-house cleanouts in Grand Rapids and across Itasca County. These jobs usually come at a hard time, so we work at whatever pace you set and take direction on what stays and what goes.",
      covers: [
        "Whole-house clearing, room by room",
        "Basements, attics and crawlspaces",
        "Garages and outbuildings",
        "Furniture, appliances and household goods",
        "Boxes, papers and decades of stored items",
        "Clearing a property ahead of a sale or listing"
      ],
      whenYouNeedIt: [
        "Settling a parent's or relative's estate",
        "A property has to be empty before closing",
        "A move into assisted living",
        "Years of stored belongings that have to be dealt with at once"
      ],
      faqIds: ["move-it", "cost", "areas", "same-day"],
      related: ["garage-cleanouts", "furniture-removal", "junk-removal"],
    },
    {
      title: "Garage Cleanouts",
      slug: "garage-cleanouts",
      blurb: "Get the stall back. Decades of stacked boxes gone in an afternoon.",
      icon: Warehouse,
      // TODO PHOTO: no garage job photo exists. Falls back to the truck. See HANDOFF.md.
      photoKey: "truck-01-dump-trailer-grand-rapids",
      metaTitle: "Garage Cleanouts in Grand Rapids, MN | Just Junk It",
      metaDescription: "Garage cleanouts in Grand Rapids and across Itasca County, MN. Get the stall back \u2014 we clear it out and sweep up behind us. Call or text (218) 256-1340.",
      intro: "Just Junk It clears garages in Grand Rapids and across Itasca County. Most garages fill up one box at a time over years, which is why they are hard to tackle in a weekend and easy to clear in an afternoon with a truck and trailer at the door.",
      covers: [
        "Stacked boxes and totes",
        "Old tools, hardware and workbenches",
        "Bikes, sleds and sporting gear",
        "Broken lawn equipment and snowblowers",
        "Scrap wood, metal and leftover building material",
        "Shelving and cabinets once they are emptied",
        "Tyres and wheels"
      ],
      whenYouNeedIt: [
        "You want to park a vehicle in there again",
        "Selling the house and the garage is the problem room",
        "Years of storage that has quietly become junk",
        "Making space before winter"
      ],
      faqIds: ["move-it", "cost", "same-day", "areas"],
      related: ["estate-cleanouts", "snow-removal", "junk-removal"],
    },
    {
      title: "Yard Waste Removal",
      slug: "yard-waste-removal",
      blurb: "Brush, branches, leaves and storm debris off the property for good.",
      icon: Leaf,
      photoKey: "after-01-brush-birch-grand-rapids",
      metaTitle: "Yard Waste Removal in Grand Rapids, MN | Just Junk It",
      metaDescription: "Yard waste and brush removal in Grand Rapids and Itasca County, MN. Branches, brush piles and storm debris hauled off. Call or text (218) 256-1340.",
      intro: "Just Junk It hauls brush, branches and yard waste out of properties across Grand Rapids and Itasca County. Northern Minnesota puts a lot of wood on the ground, and a brush pile does not go away on its own.",
      covers: [
        "Brush and branch piles",
        "Storm-downed limbs",
        "Cut saplings and cleared undergrowth",
        "Leaves and garden waste",
        "Old fencing and landscape timbers",
        "Sod, soil and stumps once they are out of the ground"
      ],
      whenYouNeedIt: [
        "A pile left over from clearing a lot or a treeline",
        "After a wind or ice storm",
        "Opening a property up in spring",
        "A brush pile that has been sitting since last season"
      ],
      faqIds: ["areas", "cost", "same-day", "move-it"],
      related: ["construction-debris-removal", "snow-removal", "junk-removal"],
    },
    {
      title: "Construction Debris Removal",
      slug: "construction-debris-removal",
      blurb: "Remodel leftovers, torn-out flooring, drywall, lumber and shingles.",
      icon: HardHat,
      // TODO PHOTO: no construction job photo exists. Falls back to the truck.
      photoKey: "truck-01-dump-trailer-grand-rapids",
      metaTitle: "Construction Debris Removal in Grand Rapids, Minnesota",
      metaDescription: "Construction and remodel debris removal in Grand Rapids and Itasca County, MN. Drywall, flooring, lumber and shingles hauled off. Call or text (218) 256-1340.",
      intro: "Just Junk It clears construction and remodel debris from job sites and homes across Grand Rapids and Itasca County. A finished remodel still looks unfinished while the torn-out material is stacked in the driveway.",
      covers: [
        "Torn-out flooring, carpet and underlay",
        "Drywall and plaster",
        "Scrap lumber and trim",
        "Shingles and roofing tear-off",
        "Old cabinets, counters and fixtures",
        "Windows and doors",
        "Siding and decking boards"
      ],
      whenYouNeedIt: [
        "A remodel is done and the debris is still on site",
        "A tear-out that filled the garage or driveway",
        "A contractor left the material behind",
        "Clearing a site before the next trade arrives"
      ],
      faqIds: ["cost", "areas", "move-it", "what-we-take"],
      related: ["garage-cleanouts", "yard-waste-removal", "junk-removal"],
    },
    {
      title: "Hot Tub & Shed Removal",
      slug: "hot-tub-and-shed-removal",
      blurb: "Broken down, cut up and carried out. The heavy, awkward stuff.",
      icon: Waves,
      // TODO PHOTO: no hot tub or shed job photo exists. Falls back to the truck.
      photoKey: "truck-01-dump-trailer-grand-rapids",
      metaTitle: "Hot Tub & Shed Removal in Grand Rapids, MN | Just Junk It",
      metaDescription: "Hot tub and shed removal in Grand Rapids and Itasca County, MN. Broken down, cut apart and carried out \u2014 the heavy awkward stuff. Call or text (218) 256-1340.",
      intro: "Just Junk It removes hot tubs and sheds from properties in Grand Rapids and across Itasca County. Neither one comes out in one piece: a hot tub has to be drained and cut apart, and a shed has to be dismantled where it stands.",
      covers: [
        "Hot tubs and spas, drained and cut down",
        "Surrounds, steps and covers",
        "Wooden and metal storage sheds",
        "Playsets and swing sets",
        "Above-ground pool frames and liners",
        "Old decking around a removed tub"
      ],
      whenYouNeedIt: [
        "A tub that has not been filled in years",
        "A shed that has rotted or blown apart",
        "Reclaiming the corner of the yard it is sitting on",
        "Clearing the property before it is listed"
      ],
      faqIds: ["cost", "move-it", "areas", "what-we-take"],
      related: ["yard-waste-removal", "construction-debris-removal", "junk-removal"],
    },
    {
      /**
       * THE SNOW DIVISION'S ENTRY (Aug 2026). Lives in this array so the footer service
       * list, sitemap machinery and `related` cross-links can all resolve it — but its
       * page is app/snow-removal/page.tsx (the division home), NOT lib/service-page.tsx,
       * and ServicesGrid deliberately filters it out of the junk page's "What we haul"
       * grid. No metaTitle/covers here: the snow page pulls its copy from `snow` above.
       */
      title: "Snow Removal",
      slug: "snow-removal",
      blurb: "First season on the snow. Same guy, same straight answers, free quotes.",
      icon: Snowflake,
      photoKey: "stock-snow-01-driveway-pines",
    },
  ] as Service[],

  /**
   * Six FAQs, rendered visibly on the homepage. The FAQPage schema is built from EXACTLY
   * this array — never a superset — so the markup can never claim a Q&A the page does not
   * show.
   *
   * Every answer is grounded in a confirmed fact: the town list, the Mon-Sat 7-7 hours, the
   * free-quote and upfront-pricing points from Trystan's own site, and the "you point, we
   * load" pitch. There are no prices, no timeframes, no volume claims and no list of what
   * is refused — we have not confirmed a disposal policy, so question 6 tells people to ask
   * rather than inventing an answer.
   */
  faqs: [
    {
      id: "areas",
      q: "What areas do you cover?",
      a: "Grand Rapids and the surrounding Itasca County area, including Cohasset, Coleraine, Bovey, Marble, Taconite, Pengilly, Nashwauk, Deer River, Bigfork, Hill City, Remer and Pokegama Lake. If your town is not on that list, call anyway and you will get a straight answer.",
    },
    {
      id: "cost",
      q: "How much does junk removal cost?",
      a: "Quotes are free. Tell us what you have and where it is, and you get a clear price before we start. What we quote is what you pay.",
    },
    {
      id: "move-it",
      q: "Do I have to move anything to the curb first?",
      a: "No. That is the whole point. Leave it where it sits, point at it, and we carry it out. You do not lift, drag or load anything.",
    },
    {
      id: "same-day",
      q: "Can you come out today?",
      a: "Same day service is available. Call or text early in the day and there is a good chance we can get to it, though it depends on what is already booked.",
    },
    {
      id: "hours",
      q: "What are your hours?",
      a: "Monday through Saturday, 7am to 7pm. Call or text 218-256-1340 during those hours and you will reach Trystan directly.",
    },
    {
      id: "what-we-take",
      q: "What kind of junk do you take?",
      a: "Furniture, appliances, yard waste and brush, construction debris, hot tubs and sheds, garage and estate cleanouts, and general household junk. If you are not sure whether we can take something, send a photo by text and we will tell you.",
    },
  ] as Faq[],

  /**
   * ⚠ EMPTY UNTIL REAL REVIEWS ARRIVE. DO NOT WRITE ANYTHING HERE.
   *
   * No review has been supplied — no text, no names, no ratings, no source. Every
   * reviews surface on this site (the homepage strip, the /reviews page, the carousel)
   * checks this array and renders NOTHING while it is empty. The nav link to /reviews is
   * hidden too. Nothing looks broken; the section simply is not there.
   *
   * When they arrive, paste them VERBATIM — real name as shown on the platform, real
   * wording, typos and all. A tidied review is a fabricated one.
   *
   * ⚠ NO Review OR AggregateRating SCHEMA WILL BE EMITTED, even once this is populated.
   * Self-serving review markup on your own domain is against Google's structured data
   * guidelines and is a penalty risk. The reviews are shown to humans as plain text.
   * That is deliberate — do not "fix" it by adding rating markup later.
   */
  /**
   * REAL Google reviews, supplied by Jacob. Reproduced VERBATIM — including the two that
   * spell the owner's name "Tristan" rather than "Trystan", and Vickie's missing
   * apostrophe in "Im". Do not correct them. A tidied review is a fabricated one, and the
   * wording is checkable against the live Google listing.
   *
   * ALL FIVE STARS, confirmed by Jacob. Shown as stars to humans.
   *
   * ⚠ NO Review OR AggregateRating SCHEMA IS EMITTED ANYWHERE ON THIS SITE, and none may
   * be added later. Self-serving review markup on your own domain is against Google's
   * structured data guidelines and is a penalty risk — that is true whether the reviews
   * are real or not, so being genuine does not make it safe. Stars belong on the Google
   * Business Profile, which Google already trusts.
   *
   * THREE REVIEWS ARE DELIBERATELY MISSING. Courtney Eden, Tiffany Jenniges and Stir Frei
   * were all truncated with "… More" in the source paste, so their full text is not known.
   * Publishing a review that stops mid-thought misrepresents what the person wrote. Get
   * the untruncated text from the Google listing and they can be added — Tiffany's in
   * particular (land clearing, old campers, a tractor) is strong evidence for the kind of
   * big job the photo set does not cover. Listed in HANDOFF.md.
   */
  reviews: [
    {
      "author": "Tom",
      "source": "Google",
      "rating": 5,
      "services": [
        "garage-cleanouts",
        "junk-removal"
      ],
      "body": "From start to finish Trystan did an outstanding job. We really needed to have our garage cleaned out from years of everything you could think of. Trystan delivered and I would highly recommend him."
    },
    {
      "author": "Lora Budach",
      "source": "Google",
      "rating": 5,
      "services": [
        "junk-removal"
      ],
      "body": "Trystan is fast, friendly, and respectful. He will quote you a cost up front for your junk removal. 100% would recommend."
    },
    {
      "author": "Pete",
      "source": "Google",
      "rating": 5,
      "services": [
        "furniture-removal",
        "yard-waste-removal"
      ],
      "body": "Trystan was a great help. He removed furniture and a big brush pile under 30 minutes. He was very professional and would 100% recommend his services."
    },
    {
      "author": "Vickie Ekstedt",
      "source": "Google",
      "rating": 5,
      "services": [
        "appliance-removal"
      ],
      "body": "Tristan removed our water heater and had it all under his belt. And did the job fast with a nice attitude. Im so pleased with this guy I will call this company again thank you Tristan. And I will tell all I know about this company."
    },
    {
      "author": "Christina",
      "source": "Google",
      "rating": 5,
      "services": [
        "junk-removal"
      ],
      "body": "Easy to arrange, no hassle, fast service. Professional and courteous."
    },
    {
      "author": "Patrice Curtiss",
      "source": "Google",
      "rating": 5,
      "services": [
        "junk-removal"
      ],
      "body": "We were very pleased with the work and how friendly Tristan was."
    },
    {
      "author": "Judith Young",
      "source": "Google",
      "rating": 5,
      "services": [
        "junk-removal"
      ],
      "body": "Trystan and friend were very professional!\nHard workers!"
    }
  ] as Review[],

  gallery: {
    heading: "Before and after",
    body: "Every photo on this site is a real job in Itasca County. No stock photos, no staging.",
    /**
     * The three approved pairs, in the order they appear. Captions are deliberately narrow:
     * pair 03 says BRUSH, not "junk", because the boat and truck bed visible in both frames
     * were not part of that job. See seo/PHOTO-INVENTORY.md.
     */
    pairs: [
      {
        beforeKey: "before-01-brush-birch-grand-rapids",
        afterKey: "after-01-brush-birch-grand-rapids",
        caption: "Brush pile cleared from a birch stand in Grand Rapids. Same morning.",
      },
      {
        beforeKey: "before-02-basement-estate-cleanout",
        afterKey: "after-02-basement-estate-cleanout",
        caption: "Basement estate cleanout in Grand Rapids, emptied to bare concrete in about an hour.",
      },
      {
        beforeKey: "before-03-brush-pile-wooded-lot",
        afterKey: "after-03-brush-pile-wooded-lot",
        caption: "Brush and yard waste hauled off a wooded lot in Itasca County.",
      },
    ],
    /** Standalone job photos. The two carport frames are never shown adjacent. */
    singles: [
      "job-03-carport-packed-full",
      "job-01-basement-books-estate-cleanout",
      "job-04-carport-emptied",
      "job-02-basement-appliances",
    ],
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
     * LIVE (Aug 2026). The Business row exists in the platform database and this is its
     * slug, supplied by Jacob as a verbatim literal. The form POSTs for real.
     *
     * ⚠ Hardcoded string literal ON PURPOSE — no env var, no fallback, no `??`. The
     * build-time guard (lib/require-live-config.ts + scripts/preflight.mjs) reads this
     * exact literal and still protects the two bad states: empty slug, and a slug set
     * while a stale NEXT_PUBLIC_DEMO_MODE=true is present. Do not delete the guard.
     *
     * The endpoint returns HTTP 200 even when businessSlug matches no Business row, so a
     * WRONG slug is silent lead loss and a green success message proves nothing. If this
     * value ever changes, verify against the live Neon row and send one real test
     * submission that lands as a WebsiteLead in the dashboard.
     */
    businessSlug: "just-junk-it",
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
    { label: "Junk Removal", href: "/junk-removal" },
    { label: "Snow Removal", href: "/snow-removal" },
    { label: "Gallery", href: "/gallery" },
    { label: "Reviews", href: "/reviews" },
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
      /**
       * `/` is now a two-way chooser, so its title is brand-led rather than keyword-led —
       * the junk keywords belong to /junk-removal, which is the real landing page and the
       * Google Ads destination. Splitting them stops the two pages competing.
       */
      home: {
        path: "/",
        title: `Just Junk It | Junk & Snow Removal, ${GEO_LEAD} MN`,
        description: `Junk removal and snow removal in ${GEO_LEAD} and across ${GEO_REGION}, Minnesota. Locally owned, same day service available. Call or text ${PHONE_DISPLAY}.`,
      },
      junkHome: {
        path: "/junk-removal",
        title: `Junk Removal & Hauling in ${GEO_LEAD}, MN | Just Junk It`,
        description: `Junk removal and hauling in ${GEO_LEAD} and across ${GEO_REGION}. You point, we load, it's gone. Same day service available. Call or text ${PHONE_DISPLAY}.`,
      },
      snowHome: {
        path: "/snow-removal",
        title: `Snow Removal in ${GEO_LEAD}, Minnesota | Just Junk It`,
        description: `Snow removal in ${GEO_LEAD} and across ${GEO_REGION}, Minnesota. Locally owned and operated. Call or text ${PHONE_DISPLAY} to ask about winter availability.`,
      },
      gallery: {
        path: "/gallery",
        title: `Junk Removal Before & After Photos | ${GEO_LEAD} MN`,
        description: `Real before and after photos from junk removal and cleanout jobs across ${GEO_REGION}, Minnesota. Every photo on this page is from an actual job.`,
      },
      contact: {
        path: "/contact",
        title: `Free Junk Removal Quote | ${GEO_LEAD} & Itasca County`,
        description: `Request a free quote for junk removal or hauling in ${GEO_LEAD} and ${GEO_REGION}. Call or text ${PHONE_DISPLAY}, or send the form and get a call back.`,
      },
      serviceAreas: {
        path: "/service-areas",
        title: `Junk Removal Service Area | ${GEO_REGION}, Minnesota`,
        description: `Just Junk It covers ${GEO_LEAD}, Cohasset, Coleraine, Bovey, Deer River, Bigfork, Nashwauk and the rest of ${GEO_REGION}, MN. Call or text for a quote.`,
      },
      reviews: {
        path: "/reviews",
        title: `Junk Removal Reviews | Just Junk It, ${GEO_LEAD} MN`,
        description: `What customers in ${GEO_LEAD} and ${GEO_REGION} say about Just Junk It after a junk removal, cleanout or hauling job. Read them in full, unedited.`,
      },
      gallery2: {
        path: "/gallery",
        title: `Junk Removal Before & After Photos | ${GEO_LEAD} MN`,
        description: `Real before and after photos from junk removal and cleanout jobs across ${GEO_REGION}, Minnesota. Every photo on this page is from an actual job.`,
      },
      privacy: {
        path: "/privacy",
        title: "Privacy Policy | Just Junk It, Grand Rapids Minnesota",
        description:
          "How Just Junk It in Grand Rapids, Minnesota handles the information you submit through this website, including phone numbers given for text message reply.",
      },
    },
  },
} as const;

export type Site = typeof site;
