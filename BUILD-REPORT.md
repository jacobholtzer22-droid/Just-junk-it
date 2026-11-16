# BUILD-REPORT: just-junk-it, site_update (tracking install)

**I did not apply this. No site code or config was changed.** The only file this run adds is this report. `INSTRUCTIONS.md` was read and left untouched.

## Summary

This repo was not made from AA-Template, so none of the template's files exist here: no `lib/config.ts`, no `lib/config-schema.ts`, no zod, no `scripts/verify.ts` and no `npm run verify` script. **Google Ads tracking is already live** on this site, with the same Ads ID and the same two conversion labels the instructions ask for. Commit `f0b752d` ("Add Google Ads conversion tracking") added it on Aug 21, 2026.

If I had applied the instructions, every page would load gtag twice and every form submit and phone tap would count as **two** conversions. That would quietly corrupt the campaign's numbers, so I left the site as it is.

## 1. What was asked

Part 1: add the template's tracking support (`components/GoogleTag.tsx`, a layout change, a zod `tracking` schema field, verify check 22). Part 2: add a `tracking` block to `site.config.ts` with `googleAdsId: 'AW-18397156416'`, form `AW-18397156416/13bECOzyweUcEMCoucRE`, call `AW-18397156416/aLZJCNWXtOUcEMCoucRE`.

## 2. What is already in the repo (checked, not assumed)

| Requested | Already in this repo |
|---|---|
| Ads ID `AW-18397156416` | `site.ads.tagId: "AW-18397156416"` in `site.config.ts` |
| Form conversion `…/13bECOzyweUcEMCoucRE` | `site.ads.conversions.contact: "13bECOzyweUcEMCoucRE"`, fired by `components/ContactForm.tsx` only after `res.ok` (a failed POST shows the error state and fires nothing) |
| Call conversion `…/aLZJCNWXtOUcEMCoucRE` | `site.ads.conversions.call: "aLZJCNWXtOUcEMCoucRE"`, fired by `components/TelLink.tsx`. Every `tel:` link on the site goes through `TelLink` (grep found no other `tel:` link) |
| (not requested) | A third conversion is also live: SMS tap `QjNZCMmXtOUcEMCoucRE` via `SmsLink`. The template's GoogleTag has no SMS conversion, so switching to it would drop this one |
| gtag loader on every page | `components/Analytics.tsx`, rendered in `app/layout.tsx` |

`fireConversion()` builds `${tagId}/${label}`, so the `send_to` values it fires match the requested labels character for character.

## 3. Gate / verification

`npm run verify` does not exist in this repo, so the workflow's "Verify gate" step will fail with a missing-script error. **That is not a site failure.** It is the same template mismatch, and I did not add a verify script, because writing a gate in CI is out of scope and the template's `verify.ts` must not be edited here.

What I ran instead:

- `npm run build` (preflight plus `next build`) passes: 22 static routes, types and lint OK.
- Every built page has the gtag loader `googletagmanager.com/gtag/js?id=AW-18397156416`, checked in `.next/server/app/*.html`: `/`, `/contact`, `/junk-removal`, `/snow-removal`, `/gallery`, `/reviews`, `/service-areas`, `/privacy`, all 9 other service pages and `_not-found`. That is 17 of 17 HTML pages.
- Both the form label and the call label are in the shipped client bundle (`static/chunks/563-*.js`).

## 4. Screenshots / Phase 5 self-check

Not applicable. There were no design, content or component changes.

## 5–7. Photos, stock, old site

Not applicable to this run. There was no `ASSETS.json`, `STOCK.json` or `OLD-SITE.json`, and no new facts were added.

## 8. Needs a human decision

1. **The instructions conflict with AGENT.md's CI rules.** Step 3 asks me to edit `lib/config-schema.ts` and step 4 asks me to edit `scripts/verify.ts`. Both are on AGENT.md's "Forbidden in CI, without exception" list. AGENT.md also says a tracking-install diff that touches any file but `site.config.ts` is wrong by construction. In this repo neither file exists, so obeying the instructions would mean creating them.
2. **The instructions are cut off.** The check 22 snippet in step 4 stops mid-block (the `for` loop and the `if (t?.googleAdsId)` block are never closed, and nothing records a pass or a failure). It could not have been copied "exactly as given" even in a template repo.
3. **The repo does not match the template.** The snippets assume `@/lib/config` exporting `config`, a zod schema, a `cfg`/`pages`/`record` verify harness and a `MobileCallBar`. This repo has `site` from `@/site.config`, plain TypeScript types, no zod dependency, no verify harness and a `MobileCtaBar`. Adding them would be a migration, not a tracking install.
4. **Recommendation:** close this PR without merging and mark the tracking install for just-junk-it as already done in the ops platform. The live tag, ID and both labels already match the dispatch. If the platform needs check 22 to pass on this repo, someone has to decide whether to migrate it to AA-Template in its own planned job. That job would need to replace `Analytics.tsx`/`fireConversion` rather than add GoogleTag beside it (to avoid double-firing), and decide whether to keep the SMS conversion.
5. Separate from this run: HANDOFF.md says DNS for `justjunkitmn.com` is still waiting on client approval. I did not touch it.
