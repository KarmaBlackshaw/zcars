# Sections (top half): Nav, Hero, Partners, Services Spec

> Round 2 (h09): applies approved amendments D-A3 (hero frame), D-A8 (`h-nav`, `spacing.nav` in hero min-height), D-A12, D-A15, E-A9 (QA on prerendered preview), TD-D1 note, hydration (hero animates once), DX (inline copy listed in README).

## Overview

- **Target file:** `/Users/admin/Documents/personal/zcars/src/components/Home/Services/index.vue` (plus the rest)
- **Owned files (this builder only):** `src/components/Layout/Nav.vue`, `src/components/Home/Hero.vue`, `src/components/Home/Partners.vue`, `src/components/Home/Services/index.vue`, `src/components/Home/Services/Cell.vue`
- **Complexity:** `[med]`
- **Wave:** 2 (parallel with sections-bottom) · **Depends-on:** scaffold, design-tokens, content-and-base

## Responsibility

Port the reference page's upper sections (header through services bento) to presentational SFCs that match `docs/reference/index.html` 1:1.

## Skills

- **Baked (do NOT re-invoke):** `vue-best-practices` (SSR-safe: no browser API in setup), `web-component-design`, `tailwind-color-token` (only the tokens listed below).
- **Builder MUST invoke before coding:** gstack `browse` for the render-check, run against the PRERENDERED build: `npm run build && npm run preview` (http://localhost:4173), NOT `npm run dev`. Compare with `docs/reference/index.html` at 1440x900 and 390x844; fix layout diffs before reporting done.
- **QA emphasis (Phase 5, orchestrator):** gstack `qa` on `npm run build && npm run preview` (hero entrance plays once with no replay on hydration; nav anchors; logo click at top does not move, from Visit lands at 0; `tel:` CTA; widths 320/390/768/1024/1440 with no page x-scroll; both color schemes; reduced motion; touch: no sticky hover; keyboard ring on brand, desk links, CTA, hero CTAs, partners region; one `montero` request; hero frame shows surface on throttled load; zero console errors), gstack `design-review` (1:1 vs reference, overlay text contrast on service photos), gstack `review` (heavy lane).

## Source of truth

`/Users/admin/Documents/personal/zcars/docs/reference/index.html`: CSS lines 21-188, markup lines 198-280. Copy every visible string verbatim. Translate each CSS rule to Tailwind utilities with the tokens below. Tailwind preflight is on: UA default margins the reference implicitly relied on are NOT ported (accepted delta); port every explicit declaration. Inline copy (hero H1/lead, services heading/lead) stays in these files; README's content map points here (do not move it to constants).

## Tokens available (from design-tokens + Tailwind defaults)

Colors `bg surface line fg muted accent accent-text` (alpha-capable), `brilliantBlue bunker sportyWhite ghost inkBlack`, `white` (`text-ghost` is the muted-on-dark color, NOT the ghost button, D-A12); spacing `nav` (68px: `h-nav`, `theme(spacing.nav)`); `rounded-card`; `font-sans`; screens `desk:` (900px) and `md:` (768px); `text-h1 text-h2 text-h3 text-lead`; `tracking-eyebrow`; `ease-settle`, `duration-800`; `animate-rise`. Global base already styles `h1,h2,h3`, body, and `:focus-visible` (ring on every focusable). `hover:` only fires on hover-capable devices (Tailwind `future.hoverOnlyWhenSupported`); write plain `hover:`.

## Shared building blocks (exist after wave 1, do not modify)

- `BaseContainer` (pass layout classes on it), `BaseButton` (`href`, `variant: "primary" | "ghost"`, `size: "md" | "sm"`, default slot), `BaseEyebrow` (slot).
- From `"@/types"`: `NAV_LINKS`, `PHONE_DISPLAY`, `PHONE_HREF`, `SERVICES`, `TService`, `PARTNER_NAMES`.
- `import { vReveal } from "@/directives/reveal";` then `v-reveal` wherever the reference has class `reveal`. The directive leaves in-view-at-mount elements alone, so no hydration blink.
- Icons: explicit `import { PhPhone, PhMapPin } from "@phosphor-icons/vue";`. Every icon `aria-hidden="true"`, `class="shrink-0"` in flex rows; default size `1em`; `:size` only where the reference sets one (plain service cell: `:size="32"`).

## Per-component spec

- **LayoutNav** (`Layout/Nav.vue`): `<header class="sticky top-0 z-10 border-b border-line bg-bg/[.82] backdrop-blur-[14px]">` > `BaseContainer` with `flex h-nav items-center justify-between gap-4` (D-A8, was `h-[68px]`). Brand `<a href="#top" aria-label="Zcars Auto Detailing Garage, home">` (`flex items-center gap-3 font-bold [font-stretch:115%]`) with logo `<img>` (import `@/assets/images/logo.webp`, `alt=""`, width/height 40, `size-10 rounded-full`) + `Zcars`. `#top` lands at scroll 0 natively because `main#top` has `scroll-mt-nav` (scaffold, D-A4). Links: `<nav aria-label="Primary" class="hidden desk:block">` > `<ul class="flex gap-8">` v-for `NAV_LINKS` > `<a>` `font-medium text-muted hover:text-fg`. CTA `BaseButton size="sm" :href="PHONE_HREF"` with `PhPhone` + `<span class="max-[480px]:sr-only">Call {{ PHONE_DISPLAY }}</span>`.
- **HomeHero** (`Home/Hero.vue`): `<section>` > `BaseContainer` with `grid min-h-[calc(100dvh-theme(spacing.nav))] items-center gap-10 pb-16 pt-12 desk:grid-cols-[1.15fr_.85fr] desk:gap-16 desk:pt-8` (D-A8). Left `<div>`: `BaseEyebrow` (`PhMapPin` + `Sagkahan, Tacloban City`), `h1` (`text-h1 mb-5 mt-4`) `Paint, protection and shine. <em class="not-italic text-accent-text">One shop.</em>`, `p` (`max-w-[60ch] text-lead text-muted`), actions `div.mt-8.flex.flex-wrap.gap-3` with `BaseButton :href="PHONE_HREF"` (`PhPhone` + `Call {{ PHONE_DISPLAY }}`) and `BaseButton variant="ghost" href="#services"` (`See services`). `figure` `relative aspect-[4/5] max-h-[78dvh] overflow-hidden rounded-card bg-surface` (D-A3: surface frame while loading / on failure) > img (import `montero.webp`, alt verbatim, width 540 height 960, `fetchpriority="high"`, `size-full object-cover`). Its hashed `src` must equal the `index.html` preload href (one request). Entrance: every reference `hero-in` element gets `motion-safe:animate-rise` + delay class: eyebrow none, h1 `motion-safe:[animation-delay:90ms]`, p and figure `motion-safe:[animation-delay:180ms]`, actions `motion-safe:[animation-delay:270ms]` (no `:style`, no CSS var). The animation is pure CSS in prerendered HTML; production hydration reuses the DOM, so it plays once.
- **HomePartners** (`Home/Partners.vue`): `<section aria-label="Products we use" class="border-t border-line py-12">` > `BaseContainer v-reveal`. `p` (`mb-4 text-[.9375rem] text-muted`) built in script from `PARTNER_NAMES`, rendering EXACTLY `We work with products from Menzerna, 3M, Solar Gard, Mobil, Anzahl, Microtex, Timeless and Rocci.` (no Oxford comma; no `Intl.ListFormat`). Panel `<div tabindex="0" role="region" aria-label="Partner logos" class="overflow-x-auto rounded-card bg-white px-6 py-4">` (gets the global focus ring) > img (import `partners.webp`, alt verbatim, width 1408 height 125, `loading="lazy"`, `h-auto w-full min-w-[720px]`).
- **HomeServices** (`Home/Services/index.vue`): `<section id="services" class="py-24">` > `BaseContainer`: `h2.mb-4` + `v-reveal` (`Everything your car needs`), lead `p` (`max-w-[60ch] text-lead text-muted`) + `v-reveal`, grid `div` `mt-12 grid gap-4 desk:grid-cols-[1.3fr_1fr] desk:grid-rows-[300px_300px]` with `HomeServicesCell v-for="(service, index) in SERVICES" :key="service.id" :service="service"` and `:class="{ 'desk:row-span-2': index === 0 }"` (fixed per item, never re-patched, so it does not wipe the directive's classes, D-A12).
- **HomeServicesCell** (`Home/Services/Cell.vue`): prop `service: TService` (image XOR icon union; narrow with `service.image`). Root `<article v-reveal>`; root classes chosen in script by variant:
  - photo (`service.image`): `group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-card border border-line bg-surface`; `<img>` from `service.image` (`src alt width height`, `loading="lazy"`) `absolute inset-0 size-full object-cover transition-transform duration-800 ease-settle motion-safe:group-hover:scale-[1.04]`; body `div` `relative bg-gradient-to-t from-inkBlack/[.92] from-30% to-inkBlack/0 p-7 pt-24 text-sportyWhite` > `h3`, `p.mt-2.max-w-[42ch].text-ghost`, tags.
  - plain (`service.icon`): `relative flex flex-col justify-between overflow-hidden rounded-card border border-line bg-surface p-7`; `component :is="service.icon" :size="32" aria-hidden="true" class="text-accent-text"`; `div` > `h3`, `p.mt-2.text-muted`, tags.
  - tags: `<ul role="list" class="mt-4 flex flex-wrap gap-2">` > `li` `rounded-full px-3 py-[.3rem] text-[.8125rem] font-semibold` + photo `border border-white/[.18] bg-white/10` / plain `border border-line`.
  - Scrim threshold (D-A15): if QA measures text over a photo below 4.5:1, change `from-30%` to `from-40%` and re-check; never past `from-50%` without a design-review.

## State & data

No store, no fetch, no composables (YAGNI). Script holds only wiring: imported constants, image imports, one const for the partners sentence, class-variant selection in Cell. Nothing reads `window`/`document` (SSR renders these).

## Dependencies

- **Auto-provided (DO NOT import):** Vue APIs (`computed` etc.), all components under `src/components`.
- **Explicit imports:** `@/types` constants/types, `@/directives/reveal`, `@phosphor-icons/vue` icons, `@/assets/images/*.webp`.

## Conventions checklist

- [ ] `<script setup lang="ts">` + `defineOptions({ name: "LayoutNav" })` / `HomeHero` / `HomePartners` / `HomeServices` / `HomeServicesCell`
- [ ] No raw hex, no `<style>`, no inline `style`; tokens only; no `68px` literal anywhere (use `nav` spacing)
- [ ] No inline arrays/objects in bindings except `:class` (Standards §Templates); static `true` attrs bare
- [ ] Booleans named `is/has/...`
- [ ] No `any`, no `as`; zero comments; zero em/en dashes; verbatim copy
- [ ] Icons `aria-hidden="true"` + `shrink-0` in flex rows; transforms only under `motion-safe:`
- [ ] No browser API in setup (SSR)
- [ ] No test files

## Acceptance criteria

- [ ] Markup order, copy, alt text, image dimensions, and links match the reference exactly
- [ ] `dist/index.html` contains the four sections prerendered (H1 text, `id="services"`, the partners sentence verbatim)
- [ ] Browse on preview at 1440x900 and 390x844 matches the reference; no page x-scroll at 320, 390, 768, 1024, 1440 (partners panel scrolls internally)
- [ ] Nav uses `h-nav`; hero uses `min-h-[calc(100dvh-theme(spacing.nav))]`; hero `figure` has `bg-surface`
- [ ] Logo click at page top does not move the page; from lower down it lands at scroll 0 with the eyebrow visible
- [ ] Hero entrance plays once on preview (no replay after JS loads); zero console errors/warnings
- [ ] Nav links hidden below 900px; CTA label visually hidden (still announced) at 480px and below
- [ ] Reduced motion: hero visible, no animation, no hover lift; revealed blocks visible
- [ ] Network shows one `montero` request
- [ ] Every Conventions box satisfied; verify passes clean

## Verify

- `cd /Users/admin/Documents/personal/zcars && cp -n .env.example .env.local; npm run build && npm run lint`
- Render-check: `npm run preview` (after the build) + gstack `browse`.
