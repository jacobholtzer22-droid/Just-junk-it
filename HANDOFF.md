# Just Junk It — Handoff

---

## ✅ GO LIVE — steps 1–3 DONE (Aug 18, 2026). Demo mode is retired.

| # | Step | Status |
|---|---|---|
| **1** | Create the Business row for Just Junk It in Neon. | ✅ Done — slug `just-junk-it` |
| **2** | Paste its **verbatim** slug into `crm.businessSlug`. | ✅ Done — hardcoded literal in [`site.config.ts`](site.config.ts), no env var, no fallback |
| **3** | Delete `NEXT_PUBLIC_DEMO_MODE` from **every** Vercel environment. | ✅ Done — removed from Production, Preview, and the local `.env.local` |
| **4** | Point `justjunkitmn.com` DNS at this project. | ⏳ **NOT YET — the client has not approved the site.** Production stays on the vercel.app domain until he does. |

The form POSTs for real now: `{ name, phone, email, message, smsConsent, businessSlug }`
to `https://www.alignandacquire.com/api/contact`, honeypot checked locally and never in
the body. **Remaining launch check:** the endpoint returns HTTP 200 even for a slug that
matches no Business row, so send one real test submission and confirm it lands as a
WebsiteLead in the platform dashboard. A green success message proves nothing on its own.

**The guard stays.** It still fails the build on an empty slug, and on a slug set while a
stale `NEXT_PUBLIC_DEMO_MODE=true` is present (both re-verified by running the builds at
go-live). Do not remove it — it is what makes a silent regression to demo state impossible.

### The guard is domain-aware — and refusing to build on a custom domain is intentional

Because demo mode now lives on Production, the old environment-based guard would have
waved through the one deployment that matters: the day a real domain gets attached. The
guard is therefore keyed on the **deployment host**, read from
`VERCEL_PROJECT_PRODUCTION_URL` (which Vercel switches to the custom domain the moment
one is attached to the project). **If steps 1 and 2 are not done, attaching
`justjunkitmn.com` makes every subsequent build fail with this checklist.** That is not
a bug to work around; it is the mechanism that makes silent lead loss on a real domain
impossible.

Three independent layers:

- [`scripts/preflight.mjs`](scripts/preflight.mjs) — fails in under a second, before
  Next starts. Fails closed: an unreadable `businessSlug` literal or an undeterminable
  host is a failure, never a pass.
- [`lib/require-live-config.ts`](lib/require-live-config.ts) — imported by
  [`app/layout.tsx`](app/layout.tsx), evaluated for every route during static
  generation, cannot be tree-shaken. Authoritative: reads the parsed config value.
- [`components/DemoCanary.tsx`](components/DemoCanary.tsx) — **runtime** canary for the
  one path builds cannot catch: a demo build *promoted* to a custom domain without a
  rebuild. Checks `window.location.hostname` on every page load and logs a loud console
  error naming the file and the fix.

Verified behaviour — every state below was RUN, not asserted (exit codes from the
actual matrix, both layers):

| Host (build-time) | `businessSlug` | `NEXT_PUBLIC_DEMO_MODE` | Build |
|---|---|---|---|
| `*.vercel.app` | empty | `true` | **passes** — the demo state |
| custom domain | empty | `true` | **FAILS** (exit 1, both layers) |
| `*.vercel.app` | empty | unset | **FAILS** — demo must be explicit |
| undeterminable (on Vercel) | empty | `true` | **FAILS** — fail closed |
| local machine | empty | `true` | passes (cannot serve a domain; canary covers promotion) |
| any | set | `true` (stale) | **FAILS** — go-live step 3 skipped |
| any | set | unset | **passes — live, form POSTs** |

No code change is needed to go live. The POST to
`https://www.alignandacquire.com/api/contact` with
`{ name, phone, email, message, smsConsent, businessSlug }` is already written and takes
effect the moment the slug is non-empty.

---

## LOGO — reworked Aug 2026: transparency keyed, base color matched to the mark

**The source file** (`Trystan Photos/6C81F79C-…PNG`, 1536×1024) **is a raster with a
baked-in near-black background and no alpha channel** — flagged at rework time because
that normally makes clean blending impossible. Two things made it fixable: the
background is uniform (sampled programmatically as **`#010000`**, the mode of the border
ring — printed by `scripts/process-logo.mjs` on every run), and every surface the mark
sits on is near-black, where keying artifacts are invisible.

The fix, both halves in `scripts/process-logo.mjs`:

1. **The site's base token `ink` is now the sampled `#010000`** (was `#0B0B0C`, 11
   levels lighter — the visible box around the logo). One place: `tailwind.config.ts`.
   Two hardcoded copies of the old value were found and fixed: `themeColor` in
   `app/layout.tsx` and the favicon background in `app/icon.svg` (which was also still
   carrying the retired `#FFD400` yellow — now paper `#F2F0EB`).
2. **The exterior background is flood-filled to real transparency** from the image
   border, so the lockup also sits clean on `surface` panels (the footer) and beside
   type. Contrast for the whole palette was re-verified against the new base — every
   pair passes its bar (paper on ink 18.4:1, accent-on-ink 3.59:1 for icons/large type,
   paper-on-accent buttons 5.13:1). Note the accent is the logo red `#C1272D`; the old
   `#FFD400` yellow left the palette in the Aug 2026 recolor.

**Placements** (all with real intrinsic `width`/`height`, zero layout shift): header
h-16 mobile / h-20 desktop (wordmark goes sr-only below `sm` so nothing overflows at
320px), `/` chooser hero right column (md+), `/junk-removal` hero beside the H1 (lg+),
footer h-28. A divider/watermark placement was tried against the design and skipped —
the hard-edged 2px-grid layout reads cluttered with a fifth mark.

The site palette was rebuilt from the logo in Aug 2026: accent is the logo's border red
`#C1272D`, chosen over the deeper banner red (~`#8E1215`) because the deep red measures
2.11:1 on the near-black background — illegible. `#C1272D` passes 3:1 for icons/large
type and carries paper text on buttons at 5.13:1, which is also exactly the logo
banner's own white-on-red treatment. Errors are amber on purpose so they can never be
mistaken for red CTAs. Full rules live at the token definitions in `tailwind.config.ts`.

---

## REVIEWS — three are missing, and why

Seven real Google reviews are live, reproduced **verbatim**: Tom, Lora Budach, Pete,
Vickie Ekstedt, Christina, Patrice Curtiss, Judith Young. All five stars, confirmed.

Two spell the owner's name "Tristan" rather than "Trystan", and Vickie's has a missing
apostrophe in "Im". **Left exactly as written.** A tidied review is a fabricated one, and
the wording is checkable against the live Google listing.

**Three are deliberately excluded** because the source paste truncated them with "… More",
so their full text is unknown. Publishing a review that stops mid-thought misrepresents
what the person wrote. Grab the untruncated text from the Google listing and they can go in:

| Reviewer | Why it is worth getting | What it covers |
|---|---|---|
| **Tiffany Jenniges** | The strongest one in the set — a big land-clearing job with old campers, a tractor and years of piled garbage, taken over after another contractor made a mess of it | Land clearing, large-scale hauling |
| **Courtney Eden** | Fridge removal on a house move into Grand Rapids, praises text response speed | Appliance removal |
| **Stir Frei** | Furniture removal | Furniture removal |

**One name needs checking: "Tom".** His display name was not in the paste — the only place
the name appears is Trystan's own reply ("Thanks, Tom!"). Confirm it against the listing
before launch. His review is currently the only social proof for **garage cleanouts**,
which is also one of the three services with no job photo, so it is doing real work on
that page.

**Lora Budach's review corroborates the pricing claim** — "He will quote you a cost up
front for your junk removal" independently backs the "Upfront Pricing, No Surprises" point
on the owner sign-off list.

### ⚠ No review schema, now or later
Stars are shown to humans. **No `Review` or `AggregateRating` structured data is emitted
anywhere on this site**, and none may be added. Self-serving review markup on your own
domain is against Google's structured data guidelines and is a penalty risk — that is true
whether the reviews are genuine or not, so being real does not make it safe. Stars belong
on the Google Business Profile, which Google already trusts. Verified by
`scripts/verify-schema.mjs`, which fails the check if a Review entity or `ratingValue`
key ever appears.

---

## SNOW REMOVAL — LIVE (Aug 2026), first season, built on confirmed facts only

`/snow-removal` is now a full service page, shipped on Jacob's instruction. What it
claims — and ALL it claims: snow removal is offered, **this is the first season** (said
plainly on the page; local-and-new beats pretending), the service area is the same
Itasca County towns as junk, quotes are free, and the business-wide facts (owner, phone,
Mon–Sat 7–7). It has its own FAQ block with FAQPage schema (4 questions, mirrored
exactly), Service schema, a footer service link, the `/` chooser panel photo, and
cross-links from Yard Waste and Garage Cleanouts.

Nothing operational is claimed anywhere, because none of it is confirmed — see CLIENT
QUESTIONS below. When Trystan answers, the copy slots in without a redesign.

### CLIENT QUESTIONS — snow specifics still needed from Trystan, one line each

- What does he actually do — plow, shovel, snow-blow, roofs, or some mix?
- Salting or sanding: offered at all?
- Residential only, commercial, or both?
- Seasonal contracts, per-visit, or both — and does he want that on the page?
- Auto-trigger at a snow depth, or does the customer call each time?
- Any response-time expectation he is comfortable committing to in writing?
- Same full town list as junk, or a tighter radius when it is snowing?
- What equipment does he run (only if he wants it mentioned)?
- Pricing structure he wants stated publicly, if any (page currently says free quotes only)?

### SWAP AFTER FIRST SNOW — stock images to replace with real job photos

The snow surfaces launched with **three stock images** (the only stock on the site —
every other photo is Trystan's real work). They are scene shots with no people and no
equipment, licensed for commercial use (sources + licenses in
[`seo/PHOTO-INVENTORY.md`](seo/PHOTO-INVENTORY.md) §7). **After the first real snowfall
with a camera on site, replace all three:**

| File (all in `public/photos/`, AVIF + WebP + 800px variants) | Where it appears |
|---|---|
| `stock-snow-01-driveway-pines.*` | `/snow-removal` hero photo band |
| `stock-snow-02-entry-steps.*` | `/snow-removal` band between FAQ and cross-links |
| `stock-snow-03-snowfall-street.*` | The snow division panel on `/` (the chooser) |

To swap: drop the real photos into `Stock Photos/`'s place in
`scripts/process-photos.mjs` (or better, into `Trystan Photos/` as normal job entries),
update the three MANIFEST entries, run `npm run photos`, and update §7 of the photo
inventory. **Stock never enters `/gallery`** — that page stays real jobs only, and the
`stock-` filename prefix exists so any violation is one grep away.

### SEO note on the chooser
Putting an interstitial at `/` costs a click before any conversion path, so it is built to
cost as little as possible: the call and text buttons sit **above** the two panels, so a
visitor who just wants to phone never has to pick a division. The junk keywords were moved
off `/` and onto `/junk-removal` so the two pages do not compete for the same query, and
`/junk-removal` — not `/` — is the Google Ads landing destination.

---

## PHOTO REQUESTS — three service pages have no honest photo

These pages currently fall back to the truck photo, described in alt text as exactly what
it is. That is honest but weak. One message to Trystan covers all of it:

| Page | Shot needed |
|---|---|
| Garage Cleanouts | A packed garage before, and the same garage empty after |
| Construction Debris Removal | A remodel debris load — torn-out flooring, drywall, lumber |
| Hot Tub & Shed Removal | A hot tub or shed mid-teardown, or loaded on the trailer |
| Furniture Removal *(weak, not absent)* | A load of furniture on the trailer |
| Snow Removal | Anything at all from winter — see above |

---

## Google Ads tracking — fill in after the account exists

Blank IDs, events wired and inert. Unlike the CRM slug these do **not** fail the build —
ads legitimately come after launch.

In [`site.config.ts`](site.config.ts) → `ads`:

| Field | Fill with | Fires on |
|---|---|---|
| `tagId` | `AW-XXXXXXXXX` | — |
| `conversions.contact` | conversion label | quote-form success |
| `conversions.call` | conversion label | any `tel:` tap |
| `conversions.text` | conversion label | any `sms:` tap |

Nothing renders and nothing fires until `tagId` matches `/^AW-/`. Config bakes in at
build time, so **redeploy without cache** after filling these.

---

## Deploy checklist

- [ ] Neon Business row exists, slug pasted, one real test submission confirmed end to end
- [ ] `NEXT_PUBLIC_DEMO_MODE` deleted from Production (keep it on Preview only)
- [ ] DNS: `www.justjunkitmn.com` is the canonical host
- [ ] Apex `justjunkitmn.com` → 308 redirect to `www`, configured at the platform level
- [ ] Demo preview URL is a `*.vercel.app` preview only — **never** a custom domain

---

## Owner sign-off — claims Trystan must confirm

Every factual claim on the site, for a yes/no pass. The full page-by-page list lands here
at Phase 4; these are the ones that already exist in config.

| Claim | Source | Needs |
|---|---|---|
| **"You get a clear quote before we start. What we quote is what you pay."** | Trystan's own current site, carried over verbatim | ⚠️ **This is a pricing commitment, not a marketing line.** It is an operational promise — no upcharges once a number is given. We did not write it; it is his existing copy. He needs to confirm he actually works this way before it goes on a page that paid traffic lands on. |
| "Same day service available" / "We make it happen when we can" | His current site, verbatim | The hedge "when we can" is load-bearing. It is the difference between availability and a guarantee. Do not let anyone tidy it away. |
| "We keep it out of landfills when we can" | His current site, verbatim | Same — hedged. Without "when we can" it becomes an environmental claim we cannot substantiate. |
| "Locally owned, Grand Rapids MN" | His current site + business facts | Confirm |
| "No job too big or too small" | His current site, verbatim | Confirm |
| Mon–Sat, 7am–7pm | Supplied business facts | Confirm, since it will appear in schema |
| Free quotes | Build brief trust strip | Confirm |
| **Permission to publish the job photos** | Photos supplied by Trystan | Routine confirmation that he is OK with these going on a public website. Worth naming specifically: `before-02` / `after-02` and `job-01` are **interiors of a customer's home** during what looks like an estate cleanout. Most owners are happy to show this work — it is the best proof on the site — but it is his customer relationship, so he makes the call. Nothing identifying is visible in any frame: no faces, no house numbers, no mail, no legible labels, all verified. |

---

## PHOTO REQUESTS — ask Trystan for these in one message

Three service pages have no honest job photo, and one has only a weak stand-in. These
pages are built to look complete without a photo, so nothing is broken while we wait —
but a real job photo will outperform any amount of type on a paid landing page.

Suggested message to send him:

> Hey Trystan — the site's coming together. Four photos would really help it convert.
> Phone camera is fine, landscape or portrait both work. If you have a before AND after
> of the same spot, even better — that's the stuff people actually stop and look at.

| # | Page it unblocks | Exactly what to ask for |
|---|---|---|
| 1 | `/garage-cleanouts` | A packed two-stall garage before a cleanout, and the same garage empty after. Shot from the same doorway both times. |
| 2 | `/construction-debris-removal` | A load of remodel or construction debris — torn-out drywall, lumber, shingles, old cabinets — either piled at the site or loaded in the trailer. |
| 3 | `/hot-tub-and-shed-removal` | A hot tub or shed before teardown, and the empty pad or slab after. Even just the empty pad with the tub in the trailer works. |
| 4 | `/furniture-removal` | A trailer or truck bed loaded with furniture — couches, mattresses, dressers. |
| 5 | Everything (highest value) | **A clean shot of the truck and dump trailer.** Daylight, whole rig in frame, not behind trees. The one we have is cropped out of another photo and the truck is half-hidden by birch trunks. This single photo would upgrade the hero and every photo-less service page at once. |
| 6 | Header / branding | A logo file, if he has one. Any format. |

Until these arrive, photo-less service pages use `truck-01-dump-trailer-grand-rapids.webp`,
whose alt text describes the truck and never implies the page's service was performed in
that frame.

---

## Everything below fills in at Phase 4

Still to be written here, per the build brief:

- Page list with title, meta description and primary keyword target for each
- The complete list of every factual claim made anywhere on the site, with its source,
  for Trystan's yes/no pass
- The full TODO list of facts still needed from him and where each one lands

### Open items blocking the rest of the build

1. **The five "Why Just Junk It" points from his current site.** Never supplied. `site.whyUs`
   is an empty array and that homepage section does not render. Nothing invented to fill it.
2. **Before/after pair approval.** See [`seo/PHOTO-INVENTORY.md`](seo/PHOTO-INVENTORY.md) —
   four proposed pairs, one of them (the carport, 7 days apart) genuinely uncertain.
3. **Photo coverage gap.** Three service pages have no honest photo: Garage Cleanouts,
   Construction Debris Removal, Hot Tub and Shed Removal. Ask Trystan.
4. **Logo file.** None supplied; the header currently renders a wordmark.

### Deviations from the brief, flagged for your call

- **`tel:` / `sms:` format.** The brief wrote `tel:2182561340`. This uses
  `tel:+12182561340` (E.164), matching the reference repo's house pattern. Bare 10-digit
  works on US handsets; E.164 is unambiguous everywhere. One-line change in
  `site.config.ts` if you want the bare form.
- **Accent colour: safety yellow `#FFD400`**, not hazard orange. On the near-black base
  it measures ~15.9:1 versus roughly 6:1 for a comparable orange. With the accent
  carrying every CTA on a phone screen outdoors, yellow is the one that stays legible.
- **A fifth guard state.** The brief specified four; the build also fails when a real slug
  is set but `NEXT_PUBLIC_DEMO_MODE` is still `true`. That state is not dangerous — the
  form posts correctly — but it means go-live step 3 was skipped, and it makes the
  environment lie about whether a deployment is live.
