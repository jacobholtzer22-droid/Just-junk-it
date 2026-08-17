# Just Junk It — Handoff

---

## ⚠️ GO LIVE CHECKLIST — three steps, in order

**This site is currently a DEMO.** The quote form validates, honeypots, requires SMS
consent, shows loading, and shows the real success screen — but it does **not** send
anywhere, because there is no Neon Business row for Just Junk It yet.

Nothing on the page says so. That is deliberate: Trystan is being shown his website,
not a caveat.

| # | Step | Where |
|---|---|---|
| **1** | Create the Business row for Just Junk It in Neon. | Neon / admin panel |
| **2** | Paste its **verbatim** slug into `crm.businessSlug`. | [`site.config.ts`](site.config.ts) line ~263 |
| **3** | Delete the `NEXT_PUBLIC_DEMO_MODE` env var, then redeploy **without build cache**. | Vercel → Project → Settings → Environment Variables |

**Copy the slug from the live row — do not retype it from memory.** The CRM endpoint
returns HTTP 200 even when `businessSlug` matches no Business row, so a wrong slug is
silent lead loss that looks identical to a working form. After step 3, send one real
test submission and confirm it lands as a WebsiteLead in the dashboard. A green success
message proves nothing on its own.

**You cannot ship the demo state by accident.** `next build` hard-fails while
`businessSlug` is empty unless `NEXT_PUBLIC_DEMO_MODE=true` is explicitly set. Two
independent layers enforce it:

- [`scripts/preflight.mjs`](scripts/preflight.mjs) — runs before `next build` via the npm
  script. Fails closed: if the `businessSlug` literal cannot even be found, that is a
  failure, not a pass.
- [`lib/require-live-config.ts`](lib/require-live-config.ts) — imported by
  [`app/layout.tsx`](app/layout.tsx). The root layout is evaluated for every route during
  static generation, so this cannot be tree-shaken out. This is the authoritative check;
  it reads the parsed config value rather than file text.

Verified behaviour, all five states:

| `businessSlug` | `NEXT_PUBLIC_DEMO_MODE` | Build | Form |
|---|---|---|---|
| empty | unset | **FAILS** (exit 1) | — |
| empty | unset, preflight bypassed | **FAILS** (exit 1, layout guard) | — |
| empty | `true` | passes | demo — no POST, console warning |
| set | unset | passes | **live — POSTs to CRM** |
| set | `true` (stale) | **FAILS** (exit 1) | — |

No code change is needed to go live. The POST to
`https://www.alignandacquire.com/api/contact` with
`{ name, phone, email, message, smsConsent, businessSlug }` is already written and takes
effect the moment the slug is non-empty.

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
