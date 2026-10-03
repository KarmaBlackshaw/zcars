# Design Tokens + Base Styles + Reveal Directive Spec

> Round 2 (h09): applies approved amendments T4, D-A1, D-A5, D-A8, E-A7 (TD-D1), E-A9, E-A10.

## Overview

- **Target file:** `/Users/admin/Documents/personal/zcars/tailwind.config.js`
- **Owned files (this builder only):** `tailwind.config.js` (fill `theme.extend` + `future`; scaffold wrote the shell in wave 0), `src/assets/style.scss` (replace the wave-0 stub), `src/directives/reveal.ts` (new)
- **Complexity:** `[med]`
- **Wave:** 1 · **Depends-on:** scaffold

## Responsibility

Provide the design system layer every section consumes: color/type/spacing/motion tokens, global element styles, and the SSR-safe `vReveal` scroll-reveal directive.

## Skills

- **Baked (do NOT re-invoke):** `tailwind-color-token` (names already resolved on color-name.com, see table), `vue-best-practices` (directive = DOM-specific behavior; SSR: browser APIs only in client hooks).
- **Builder MUST invoke before coding:** none.
- **QA emphasis (Phase 5, orchestrator):** gstack `qa` on `npm run build && npm run preview` (both color schemes; reduced motion shows every element; cold `/#visit` and mid-page refresh show no blink; below-fold blocks reveal once; touch emulation leaves no sticky hover), gstack `design-review` (token fidelity vs `docs/reference/index.html`, AA contrast dark + light, visible focus ring on every tab stop).

## Public API (exact names consumers rely on)

- **Colors (CSS-var driven, alpha-capable):** `bg`, `surface`, `line`, `fg`, `muted`, `accent`, `accent-text` → `bg-bg`, `bg-bg/[.82]`, `text-fg`, `border-line`, `text-muted`, `bg-accent`, `text-accent-text`, `outline-accent-text`.
- **Colors (static hex, named via color-name.com):**

  | token           | hex       | use                                                                         |
  | --------------- | --------- | --------------------------------------------------------------------------- |
  | `brilliantBlue` | `#1d4ed8` | primary button hover                                                        |
  | `bunker`        | `#0f1218` | repaint card background                                                     |
  | `sportyWhite`   | `#eef1f6` | text on dark/photo                                                          |
  | `ghost`         | `#c3cad6` | muted text on dark/photo (unrelated to `BaseButton variant="ghost"`, D-A12) |
  | `inkBlack`      | `#080a0e` | photo scrim gradient                                                        |

  `white` is Tailwind's default.

- `spacing.nav: "68px"` (D-A8) → `h-nav`, `scroll-mt-nav`, `min-h-[calc(100dvh-theme(spacing.nav))]`
- `borderRadius.card: "14px"` → `rounded-card`
- `fontFamily.sans: ["Archivo Variable", "Archivo", "system-ui", "sans-serif"]`
- `screens.desk: "900px"` (inside `extend`; do not touch `md`/`lg`)
- `fontSize`: `h1: ["clamp(2.25rem, 4vw, 3.4rem)", { lineHeight: "1.05" }]`, `h2: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05" }]`, `h3: ["1.25rem", { lineHeight: "1.2" }]`, `lead: "1.0625rem"`
- `letterSpacing`: `heading: "-0.02em"`, `eyebrow: ".14em"`
- `transitionTimingFunction.settle: "cubic-bezier(.16,1,.3,1)"`; `transitionDuration["800"]: "800ms"`
- `keyframes.rise: { from: { opacity: "0", transform: "translateY(24px)" } }`; `animation.rise: "rise .9s cubic-bezier(.16,1,.3,1) both"` → `motion-safe:animate-rise`
- **Top-level** `future: { hoverOnlyWhenSupported: true }` (E-A7 / TD-D1; a `future` flag in Tailwind 3.4.17, NOT `experimental`): every `hover:` emits under `@media (hover: hover) and (pointer: fine)`.
- **Directive:** `export const vReveal: Directive<HTMLElement>` from `src/directives/reveal.ts`. Consumers import it explicitly (`import { vReveal } from "@/directives/reveal";`) and write `v-reveal` on any element or component root. NOT registered globally.

## State & data

- **tailwind.config.js colors:** var tokens as `"rgb(var(--bg) / <alpha-value>)"` etc. (`"accent-text": "rgb(var(--accent-text) / <alpha-value>)"`); static tokens as hex strings.
- **style.scss** (three `@tailwind` lines first, then):
  ```scss
  @layer base {
    :root {
      --bg: 11 13 17;
      --surface: 19 22 28;
      --line: 35 40 51;
      --fg: 238 241 246;
      --muted: 163 171 185;
      --accent: 37 99 235;
      --accent-text: 107 155 255;
      color-scheme: dark;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: 244 246 249;
        --surface: 255 255 255;
        --line: 221 226 234;
        --fg: 15 20 28;
        --muted: 74 84 102;
        --accent-text: 29 78 216;
        color-scheme: light;
      }
    }
    html {
      @apply motion-safe:scroll-smooth;
    }
    body {
      @apply bg-bg font-sans text-base leading-[1.6] text-fg antialiased;
    }
    h1,
    h2,
    h3 {
      @apply font-extrabold tracking-heading [font-stretch:125%];
      line-height: 1.05;
    }
    h2 {
      @apply text-h2;
    }
    h3 {
      @apply text-h3;
    }
    :focus-visible {
      @apply outline outline-2 outline-offset-[3px] outline-accent-text;
    }
  }
  ```
  `:focus-visible` (D-A5, was `a:focus-visible`) covers the partners region, iframe, and every control. CSS `motion-safe:scroll-smooth` is the only smooth-scroll source (no router scrollBehavior exists). Prettier may reflow; values must stay. Use `@use` not `@import` if an import is ever needed.
- **reveal.ts** (T4, D-A1, E-A10), SSR-safe:
  - Module scope holds only `let observer: IntersectionObserver | undefined;` and the two literal class arrays. No `window`/`document`/`IntersectionObserver` call at module scope; no `getSSRProps`; no `beforeMount` hook.
  - Observer created lazily on first need (`observer ??= new IntersectionObserver(cb, { threshold: 0.15 })`), one shared instance. Callback: for each entry with `isIntersecting`, remove the hidden classes from `entry.target` and `unobserve` it.
  - `mounted(el)`: if `el.getBoundingClientRect().top < window.innerHeight` → return (already in or above the viewport at mount/hydration: stays visible, no animation, no blink). Otherwise add transition + hidden classes and observe. `unmounted(el)`: `observer?.unobserve(el)`.
  - Class strings literal in the file so Tailwind's content scan emits them:
    - transition: `"motion-safe:transition-[opacity,transform]"`, `"motion-safe:duration-800"`, `"motion-safe:ease-settle"`
    - hidden: `"motion-safe:opacity-0"`, `"motion-safe:translate-y-6"`
  - Reduced motion → no class applies → fully visible. No JS → prerendered HTML has no reveal classes → fully visible.
  - Known ceiling (D-A12): Vue re-patching a changed `:class` on the same element would wipe directive classes; the only dynamic `:class` near `v-reveal` (Services cell `desk:row-span-2`) is fixed per item, so never re-patched. No comment needed.
- **Data fetching:** none.

## Dependencies

- **Auto-provided (DO NOT import):** nothing used here.
- **Explicit imports:** `reveal.ts` → `import type { Directive } from "vue";`
- **Third-party:** none (native IntersectionObserver).

## Conventions checklist

- [ ] Global Standards: no `any`, no `as` (`entry.target` is an `Element`; `classList`/`unobserve` accept it, no cast); no redundant annotations (the `observer` annotation is load-bearing); zero comments
- [ ] No raw hex outside `tailwind.config.js` `colors` (Standards §Styling); var tokens are RGB triplets
- [ ] No Tailwind prefix; keep `content` and `plugins: []` from the shell; no font-stretch plugin
- [ ] No browser API at module scope (SSR pass imports this file)
- [ ] No test files

## Acceptance criteria

- [ ] Every Public API token exists with the exact value, incl. `spacing.nav` = `68px` and top-level `future.hoverOnlyWhenSupported: true`
- [ ] Built CSS (`dist/assets/*.css`): body uses `rgb(var(--bg) / 1)`; the light-scheme media query is present; `.scroll-mt-nav { scroll-margin-top: 68px }` present (consumer exists from wave 0); hover rules sit inside `@media (hover: hover) and (pointer: fine)` once consumers exist
- [ ] Base focus rule selector is `:focus-visible` (not `a:focus-visible`)
- [ ] `reveal.ts`: exports `vReveal`; only `mounted` + `unmounted` hooks; in-viewport check in `mounted`; observer created lazily, shared, threshold 0.15, unobserve after first hit; literal class strings; nothing browser-only at module scope
- [ ] `npm run build` SSR pass succeeds (would throw if IO were touched at import)
- [ ] Reduced motion: nothing hidden or animated (all motion classes `motion-safe:`)
- [ ] Every Conventions box satisfied; verify passes clean

## Verify

- `cd /Users/admin/Documents/personal/zcars && cp -n .env.example .env.local; npm run build && npm run lint`
  (`.env.local` already exists from wave 0; `cp -n` is a no-op guard.)
