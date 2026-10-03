# Typed Content + Base Primitives Spec

> Round 2 (h09): applies approved amendments T5 (TService image XOR icon), TD2 + D-A9 (`MAP_DIRECTIONS_URL`, Address fact link), D-A5 note, D-A6 (`motion-safe:active:scale`), E-A9, DX (exports are a README contract).

## Overview

- **Target file:** `/Users/admin/Documents/personal/zcars/src/types/service.ts` (plus the rest of the owned list)
- **Owned files (this builder only):** `src/types/image.ts`, `src/types/service.ts`, `src/types/contact.ts`, `src/types/navigation.ts`, `src/types/partner.ts`, `src/components/Base/Container.vue`, `src/components/Base/Button.vue`, `src/components/Base/Eyebrow.vue`
- **Complexity:** `[low]`
- **Wave:** 1 (parallel with design-tokens) · **Depends-on:** scaffold

## Responsibility

Provide the shared building blocks the section builders consume: typed content constants and three consumer-agnostic presentational primitives.

## Skills

- **Baked (do NOT re-invoke):** `vue-best-practices`, `typescript-advanced-types` (discriminated `TService`), `tailwind-color-token` (all colors are design-token names; no hex here).
- **Builder MUST invoke before coding:** none.
- **QA emphasis (Phase 5, orchestrator):** gstack `qa` on `npm run build && npm run preview` (buttons/links work; Address fact opens directions in a new tab; tapping a button on touch leaves no sticky hover; reduced motion: no hover lift, no active scale), gstack `design-review` (button states: hover lift, active scale, focus ring).

## Placement decision (orchestrator decision 8)

Content constants live in `src/types/<domain>.ts` beside their types (Standards §Files). `src/types` is barreled (`src/types/index.ts`, generated) so consumers import from `"@/types"`. File paths and export names are a public contract listed in README's content map (DX): renaming any export requires updating README in the same change (README is scaffold-owned; flag it to the orchestrator rather than editing it).

## Public API

### src/types (exact exports)

- `image.ts`: `export type TImage = { src: string; alt: string; width: number; height: number };`
- `service.ts` (T5: image XOR icon, the "neither" state is unrepresentable):
  ```ts
  type TServiceBase = { id: string; title: string; description: string; tags: string[] };
  export type TService = TServiceBase & ({ image: TImage; icon?: never } | { icon: Component; image?: never });
  ```
  (`?: never` keeps `service.image` / `service.icon` readable on both branches so `if (service.image)` narrows.) `export const SERVICES: TService[]` with 3 entries, copy VERBATIM from `docs/reference/index.html` lines 248-276:
  1. id `detailing`, title `Detailing and protection`, description `Paint correction, interior and exterior detailing, then a ceramic coat to lock in the gloss.`, tags `Interior detailing`, `Exterior detailing`, `Ceramic coating`, image `{ src: polish, alt: "Detailer machine-polishing the hood of a red car", width: 540, height: 960 }`
  2. id `repair`, title `Repair and repaint`, description `Body repair and refinishing with professional-grade paint.`, tags `Body repair`, `Repaint`, image `{ src: collision, alt: "Black SUV front end with collision damage before repair", width: 315, height: 315 }`
  3. id `upkeep`, title `Upkeep and underbody`, description `Preventive maintenance, window tint and undercoating against rust.`, tags `PMS`, `Window tint`, `Undercoating`, icon `PhShieldCheck`
- `contact.ts`: `BUSINESS_NAME = "Zcars Auto Detailing Garage"`, `PHONE_DISPLAY = "0963 745 7661"`, `PHONE_HREF = "tel:+639637457661"`, `FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100064154490589"`, `MAP_EMBED_URL = "https://www.google.com/maps?q=Zcars+Auto+Detailing+Garage+Sagkahan+Tacloban+City&output=embed"`, `MAP_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=Zcars+Auto+Detailing+Garage%2C+Sagkahan%2C+Tacloban+City"` (D-A9, exact), `export type TVisitFact = { icon: Component; label: string; text: string; href?: string; isExternal?: boolean };`, `export const VISIT_FACTS: TVisitFact[]`:
  1. `PhMapPin`, `Address`, `Sagkahan, Tacloban City, Leyte, Philippines`, href `MAP_DIRECTIONS_URL`, `isExternal: true` (TD2; text unchanged)
  2. `PhPhone`, `Phone`, `PHONE_DISPLAY`, href `PHONE_HREF`
  3. `PhFacebookLogo`, `Facebook`, `BUSINESS_NAME`, href `FACEBOOK_URL`, `isExternal: true`
- `navigation.ts`: `export type TNavLink = { label: string; href: string };` `NAV_LINKS: TNavLink[]` = Services `#services`, Team `#team`, Visit `#visit`.
- `partner.ts`: `export const PARTNER_NAMES = ["Menzerna", "3M", "Solar Gard", "Mobil", "Anzahl", "Microtex", "Timeless", "Rocci"];`
- Images: `import polish from "@/assets/images/polish.webp";` (vite/client types the module). Icons: `import { PhShieldCheck } from "@phosphor-icons/vue";` (verify export names in `node_modules/@phosphor-icons/vue` first). `import type { Component } from "vue";`
- String consts infer their type: no annotation (Standards §TypeScript); keep `TService[]` / `TVisitFact[]` / `TNavLink[]` (they validate the shape).
- `PHONE_HREF` and `FACEBOOK_URL` must match `index.html` JSON-LD `telephone` / `sameAs` (the build's DX-A4 drift check fails otherwise). Do not edit `index.html`.

### BaseContainer (`src/components/Base/Container.vue`)

- Props: none. Default slot. Root: `<div class="mx-auto max-w-[1240px] px-4 md:px-8">`. Consumer classes fall through and merge.

### BaseButton (`src/components/Base/Button.vue`)

- Props: `href: string` (required), `variant?: "primary" | "ghost"` (default `"primary"`), `size?: "md" | "sm"` (default `"md"`). Destructured defaults: `const { href, variant = "primary", size = "md" } = defineProps<{...}>();`
- Default slot (icon + text; consumers put any sr-only "(opens in new tab)" text in the slot). Root `<a :href="href">`; other attrs (`target`, `rel`) fall through.
- Classes (static maps as script `const`s keyed by the union, bound via `:class` array):
  - base: `inline-flex items-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[transform,background-color,border-color] duration-300 ease-settle motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[.98]` (D-A6)
  - primary: `bg-accent text-white hover:bg-brilliantBlue`
  - ghost: `border border-line hover:border-muted`
  - md: `px-[1.375rem] py-3.5`; sm: `px-4 py-2.5 text-[.9375rem]`
  - Focus ring comes from the global `:focus-visible` base rule (design-tokens D-A5); add none. `hover:` is hover-capable-only via Tailwind `future.hoverOnlyWhenSupported` (design-tokens); add nothing.
- Consumer-agnostic: no prop serving one section, no `isExternal` prop (Standards §Principles Open/Closed).

### BaseEyebrow (`src/components/Base/Eyebrow.vue`)

- Props: none. Default slot. Root: `<span class="inline-flex items-center gap-2 text-[.8125rem] font-semibold uppercase tracking-eyebrow text-accent-text">`.

## State & data

None (no store, no fetch, no composables).

## Dependencies

- **Auto-provided (DO NOT import):** `defineProps`, `defineOptions`; Vue APIs via auto-import.
- **Explicit imports:** images, Phosphor icons, `type Component` (listed above).
- **Third-party:** `@phosphor-icons/vue` (SSR-safe, verified).

## Conventions checklist

- [ ] Each SFC: `<script setup lang="ts">` with `defineOptions({ name: "BaseButton" })` (etc.) first
- [ ] No `any`, no `as`; unions not `string` for variant/size; `TService` is the XOR union above
- [ ] No inline arrays/objects in template bindings except `:class` arrays (Standards §Templates)
- [ ] Tailwind only, no `<style>`, no raw hex; transforms only under `motion-safe:`
- [ ] Zero comments; zero em/en dashes in copy
- [ ] No test files

## Acceptance criteria

- [ ] All exports exist with the exact names, types, and copy; `MAP_DIRECTIONS_URL` equals the D-A9 string byte for byte
- [ ] `VISIT_FACTS[0]` (Address) has `href: MAP_DIRECTIONS_URL`, `isExternal: true`, unchanged text
- [ ] A `TService` literal with neither `image` nor `icon`, or with both, fails `vue-tsc` (check by a throwaway edit, then revert)
- [ ] Button base class string contains `motion-safe:active:scale-[.98]` and no bare `active:scale`
- [ ] `components.d.ts` lists `BaseContainer`, `BaseButton`, `BaseEyebrow`; `src/types/index.ts` re-exports all five domain files after build
- [ ] Every Conventions box satisfied; verify passes clean

## Verify

- `cd /Users/admin/Documents/personal/zcars && cp -n .env.example .env.local; npm run build && npm run lint`
