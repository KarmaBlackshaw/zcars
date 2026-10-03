# Sections (bottom half): Repaint, Team, Visit, Footer Spec

> Round 2 (h09): applies approved amendments D-A2 (map loading/blocked layer), D-A3 (team frame), TD2 + D-A9 + D-A14 (Address directions link, underline every linked fact), TD-D2 (sr-only new-tab text), E-A5 (footer year `data-allow-mismatch`, supersedes D-A11), E-A9 (QA on preview), team caption shown, DX (inline copy listed in README).

## Overview

- **Target file:** `/Users/admin/Documents/personal/zcars/src/components/Home/Team/index.vue` (plus the rest)
- **Owned files (this builder only):** `src/components/Home/Repaint.vue`, `src/components/Home/Team/index.vue`, `src/components/Home/Team/Hiring.vue`, `src/components/Home/Visit.vue`, `src/components/Layout/Footer.vue`
- **Complexity:** `[med]`
- **Wave:** 2 (parallel with sections-top) · **Depends-on:** scaffold, design-tokens, content-and-base

## Responsibility

Port the reference page's lower sections (repaint band through footer) to presentational SFCs that match `docs/reference/index.html` 1:1, plus the approved Visit and footer amendments.

## Skills

- **Baked (do NOT re-invoke):** `vue-best-practices` (SSR hydration mismatch handling), `web-component-design`, `tailwind-color-token` (only the tokens listed below).
- **Builder MUST invoke before coding:** gstack `browse` for the render-check, run against the PRERENDERED build: `npm run build && npm run preview` (http://localhost:4173), NOT `npm run dev`. Compare with `docs/reference/index.html` at 1440x900 and 390x844; also load with `google.com` blocked and confirm the map fallback shows. Fix diffs before reporting done.
- **QA emphasis (Phase 5, orchestrator):** gstack `qa` on `npm run build && npm run preview` (cold `/#visit` lands on Visit with no blink; Back after nav jump returns to prior position; FB links + Address directions open new tab with `rel="noopener"` and announce "(opens in new tab)"; `tel:` fact; map loads, and with `google.com` blocked the pin + "Open in Google Maps" layer shows; team frame shows surface on throttled load; footer year current with zero console errors; keyboard ring on hiring FB, 3 fact links, iframe, footer link; widths 320/390/768/1024/1440; both schemes; reduced motion), gstack `design-review` (1:1 vs reference, dark band contrast), gstack `review` (heavy lane).

## Source of truth

`/Users/admin/Documents/personal/zcars/docs/reference/index.html`: CSS lines 141-188, markup lines 281-322. Copy every visible string verbatim. Translate each CSS rule to Tailwind with the tokens below. Preflight is on: UA margins are NOT ported (accepted delta); port every explicit declaration. Preflight strips link underlines: EVERY Visit fact with an `href` (Address, Phone, Facebook) gets `underline` explicitly (D-A14), as does the map fallback link; all other reference links set `text-decoration: none`. Inline copy (repaint, team, hiring, Visit lead, footer tagline) stays in these files; README's content map points here.

## Tokens available (from design-tokens + Tailwind defaults)

Colors `bg surface line fg muted accent accent-text` (alpha-capable), `brilliantBlue bunker sportyWhite ghost inkBlack`, `white` (`text-ghost` is the muted-on-dark color, NOT the ghost button); `rounded-card`; screens `desk:` (900px), `md:` (768px); `text-h2 text-h3 text-lead`. Global base styles `h1,h2,h3`, body, and `:focus-visible` (ring on every focusable incl. the iframe). Write plain `hover:` (hover-capable-only via Tailwind `future` flag).

## Shared building blocks (exist after wave 1, do not modify)

- `BaseContainer`, `BaseButton` (`href`, `variant`, `size`, default slot; `target`/`rel` fall through), `BaseEyebrow` (slot).
- From `"@/types"`: `PHONE_HREF`, `PHONE_DISPLAY`, `FACEBOOK_URL`, `MAP_EMBED_URL`, `MAP_DIRECTIONS_URL`, `BUSINESS_NAME`, `VISIT_FACTS`, `TVisitFact`. (`VISIT_FACTS[0]` Address now has `href: MAP_DIRECTIONS_URL, isExternal: true`.)
- `import { vReveal } from "@/directives/reveal";` then `v-reveal` wherever the reference has class `reveal` (in-view-at-mount elements are left visible: no blink on cold `/#visit`).
- Icons: explicit imports from `@phosphor-icons/vue` (`PhBriefcase`, `PhFacebookLogo`, `PhMapPin` for the map layer); every icon `aria-hidden="true"`, `shrink-0` in flex rows; sizes: Hiring `:size="28"`, Visit facts `:size="24"`, map layer pin `:size="32"`, others `1em`.
- New-tab text (TD-D2): every `target="_blank"` link that is reachable by assistive tech ends with `<span class="sr-only"> (opens in new tab)</span>` inside the link. Zero visual change.

## Per-component spec

- **HomeRepaint** (`Home/Repaint.vue`): `<section aria-labelledby="repaint-title" class="pb-8">` > `BaseContainer` > card `div v-reveal` `grid overflow-hidden rounded-card bg-bunker text-sportyWhite desk:min-h-[520px] desk:grid-cols-2`. `figure` `aspect-[4/3] desk:aspect-auto` > img (import `repaint.webp`, alt verbatim, width 540 height 634, lazy, `size-full object-cover`). Copy `div` `self-center px-7 py-10 desk:p-16` > `h2#repaint-title.max-w-[14ch]` `Prepped right, painted once.` + `p` `mt-4 max-w-[44ch] text-lead text-ghost`.
- **HomeTeam** (`Home/Team/index.vue`): `<section id="team" class="py-24">` > `BaseContainer`: intro `div v-reveal` `grid max-w-[760px] gap-4` > `h2` + lead `p` (`max-w-[60ch] text-lead text-muted`). `figure v-reveal` `mt-12`: image wrapper `div` `aspect-video overflow-hidden rounded-card bg-surface` (D-A3) > img (import `ojt.webp`, alt verbatim, width 960 height 1280, lazy, `size-full object-cover object-[center_30%]`); `figcaption` `mt-3 text-sm text-muted` `EVSU Automotive OJT at the Zcars garage.` (Deliberate, approved: the caption SHOWS; the clip moves from the `figure` to the inner div.) Then `<HomeTeamHiring />`.
- **HomeTeamHiring** (`Home/Team/Hiring.vue`): root `div v-reveal` `mt-12 grid items-center gap-5 rounded-card border border-line bg-surface p-7 md:grid-cols-[auto_1fr_auto]`: `PhBriefcase :size="28" class="text-accent-text"`, `div` > `h3` `We're hiring` + `p.text-muted`, `BaseButton variant="ghost" :href="FACEBOOK_URL" target="_blank" rel="noopener"` with slot `PhFacebookLogo` + `Message us` + the sr-only new-tab span.
- **HomeVisit** (`Home/Visit.vue`): `<section id="visit" class="border-t border-line py-24">` > `BaseContainer` `grid gap-10 desk:grid-cols-[1fr_1.2fr] desk:gap-16`.
  - Left `div v-reveal`: `BaseEyebrow` `Visit the garage`, `h2.my-4` `Drop by Sagkahan`, lead `p`, `<ul role="list" class="mt-8 grid gap-5">` v-for `VISIT_FACTS` (key `fact.label`) > `li.flex.items-start.gap-4` > `component :is="fact.icon" :size="24" aria-hidden="true" class="mt-[.1rem] shrink-0 text-accent-text"` + `div` > `strong.block.font-semibold` label + either `a.underline` (`:href="fact.href"`, `v-bind="linkAttrs(fact)"`, text, and when `fact.isExternal` the sr-only new-tab span) or `span.text-muted` text. `linkAttrs(fact)` is a script function returning `{ target: "_blank", rel: "noopener" }` for external facts and `{}` otherwise (Standards §Templates: no inline branching objects).
  - Map (D-A2): `div v-reveal` `relative min-h-[380px] overflow-hidden rounded-card border border-line bg-surface` containing, in order:
    1. Fallback layer `<div aria-hidden="true" class="absolute inset-0 grid place-content-center justify-items-center gap-2">` > `PhMapPin :size="32" class="text-accent-text"` + `<a :href="MAP_DIRECTIONS_URL" target="_blank" rel="noopener" tabindex="-1" class="text-muted underline">Open in Google Maps</a>`. It is visible only while the map loads or when it is blocked. It is deliberately out of the tab order and hidden from AT (no sr-only span needed) because a loaded map covers it, and a covered focus target would be invisible. Keyboard/SR users reach the same URL through the Address fact. The approved D-A10 tab list does not include this link.
    2. `<iframe :src="MAP_EMBED_URL" title="Map to Zcars Auto Detailing Garage, Sagkahan, Tacloban City" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="relative size-full min-h-[380px] border-0">` (`relative` so a loaded map paints over the layer).
- **LayoutFooter** (`Layout/Footer.vue`): `<footer class="border-t border-line py-8 text-sm text-muted">` > `BaseContainer` `flex flex-wrap items-center justify-between gap-4`: `<span>&copy; <span data-allow-mismatch="text">{{ year }}</span> {{ BUSINESS_NAME }}. Alagang Zcars!</span>` with `const year = new Date().getFullYear();` (E-A5: the prerendered HTML carries the build year, hydration patches the visitor's year, and the attribute suppresses Vue's prod hydration-mismatch `console.error`). Link `a` `:href="FACEBOOK_URL" target="_blank" rel="noopener"` `inline-flex min-h-6 items-center gap-[.4rem] py-1 hover:text-fg` > `PhFacebookLogo` + `Follow on Facebook` + sr-only new-tab span.

## State & data

No store, no fetch, no composables (YAGNI). Script holds only wiring: constants, image imports, `year`, `linkAttrs` in Visit. No `window`/`document` access (SSR renders these).

## Dependencies

- **Auto-provided (DO NOT import):** Vue APIs, all components under `src/components`.
- **Explicit imports:** `@/types`, `@/directives/reveal`, `@phosphor-icons/vue` icons, `@/assets/images/*.webp`.

## Conventions checklist

- [ ] `<script setup lang="ts">` + `defineOptions({ name: "HomeRepaint" })` / `HomeTeam` / `HomeTeamHiring` / `HomeVisit` / `LayoutFooter`
- [ ] No raw hex, no `<style>`, no inline `style`; tokens only (Standards §Styling)
- [ ] No inline arrays/objects/branching in bindings except `:class` (Standards §Templates); `linkAttrs` is a named function
- [ ] No `any`, no `as`; zero comments; zero em/en dashes (the apostrophe in `We're hiring` stays)
- [ ] Icons `aria-hidden="true"` + `shrink-0` in flex rows; iframe has `title`
- [ ] Every AT-reachable `target="_blank"` link has the sr-only "(opens in new tab)" span; all external links have `rel="noopener"`
- [ ] No browser API in setup (SSR)
- [ ] No test files

## Acceptance criteria

- [ ] Markup order, copy, alt text, image dimensions, and links match the reference, except the approved deltas: visible team caption, Address as a directions link, map fallback layer, sr-only new-tab text
- [ ] `dist/index.html` contains these sections prerendered (`id="team"`, `id="visit"`, footer text) and the footer year span carries `data-allow-mismatch="text"`
- [ ] Browse on preview at 1440x900 and 390x844 matches the reference; no page x-scroll at 320, 390, 768, 1024, 1440
- [ ] Address fact links to `MAP_DIRECTIONS_URL` in a new tab; Phone fact to `tel:+639637457661`; Facebook fact, Hiring button and footer link open `FACEBOOK_URL` in a new tab; all three linked facts are underlined
- [ ] Hiring button, Address fact, Facebook fact, footer link each contain `<span class="sr-only"> (opens in new tab)</span>`
- [ ] Map container is `relative` with the fallback layer before a `relative` iframe; with `google.com` blocked the pin + "Open in Google Maps" shows; the fallback link has `tabindex="-1"` inside an `aria-hidden` layer
- [ ] Team image wrapper has `bg-surface`; caption visible
- [ ] Footer shows the current year after hydration; zero console errors/warnings on preview
- [ ] Every Conventions box satisfied; verify passes clean

## Verify

- `cd /Users/admin/Documents/personal/zcars && cp -n .env.example .env.local; npm run build && npm run lint`
- Render-check: `npm run preview` (after the build) + gstack `browse`.
