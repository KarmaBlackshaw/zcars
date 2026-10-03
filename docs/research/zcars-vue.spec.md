# Zcars Vue — Feature Spec

> Round 2 (h09): updated with the APPROVED /autoplan decisions (`docs/research/autoplan-review.md`, Phase 4 gate + Decision Audit Trail rows 1-70). Component specs in `docs/research/components/` are the build source of truth.

## What

Port the verified static landing page `docs/reference/index.html` (+ `docs/reference/assets/`) to a Vue 3 + TypeScript + Vite project in `/Users/admin/Documents/personal/zcars`, with tooling mirrored from `/Users/admin/Documents/winona/patient-dashboard-next` (full mirror), prerendered to static HTML at build time with vite-ssg.

## Why

The client site must be maintainable in the owner's daily stack. The static page is the visual + content contract; visitors gain nothing from the port, so the bar is zero regressions (no-JS, deep links, link previews, first paint). Prerendering keeps static-page runtime behavior.

## Tooling (full mirror of patient-dashboard-next, minus private/irrelevant deps)

- Vite 6, Vue ^3.5.17, TypeScript ~5.7, vue-tsc, `@vitejs/plugin-vue`, `vite-plugin-vue-devtools`.
- **vite-ssg ^28.3.0** (UC1): `src/main.ts` is `export const createApp = ViteSSG(App, { routes }, setup with handleHotUpdate, { hydration: import.meta.env.PROD, useHead: false })`. `src/router.ts` does not exist (vite-ssg creates the router). No router `scrollBehavior` (UC-E1): prerendered anchors scroll natively. Static `index.html` is the only head source (no `useHead`, no `@unhead/vue` entry).
- `unplugin-vue-router` (`routesFolder: src/pages`, single route `src/pages/index.vue`), `typed-router.d.ts`.
- `unplugin-auto-import` (imports `vue`, `vue-router`, `@vueuse/core`; dirs `src/composables`, `src/utils`; `vueTemplate`, `dts`, `eslintrc` → `auto-import.json`).
- `unplugin-vue-components` (`dts`, `deep`, `directoryAsNamespace`, `collapseSamePrefixes`), no resolver.
- Local barrel index generator plugin (replaces corefront `generateIndex`) for `src/composables/`, `src/utils/`, `src/types/` in `buildStart`; barrels gitignored and watch-ignored.
- `ssgOptions` in `vite.config.ts` (typed `ViteSSGOptions`): `onBeforePageRender` fails the build on a literal `%VITE_SITE_URL%` with a problem + cause + fix message (DX-A2) and warns when it points at localhost (DX-A6); `onPageRendered` fails the build when JSON-LD `telephone` / `sameAs` disagree with the page's `tel:` / Facebook links (DX-A4).
- Tailwind 3 (`future.hoverOnlyWhenSupported: true`) + PostCSS + autoprefixer, SCSS entry `src/assets/style.scss`.
- ESLint 9 flat config mirroring the reference (ignores add `**/.vite-ssg-temp/**`), Prettier verbatim (printWidth 160, tailwind plugin).
- husky (pre-commit: `npm run type-check && npx lint-staged --no-stash`) + lint-staged; requires `git init` (no commits).
- `.nvmrc` (v24) + `package.json` `engines.node ">=20"` (DX-A3). `.gitignore` covers generated files, `dist`, `*.local`, `.vite-ssg-temp`. **Never copy the reference `.npmrc`.**
- `VITE_SITE_URL` env: committed `.env.example` (`VITE_SITE_URL=http://localhost:4173` + one-line format comment), copied to gitignored `.env.local` for local builds; the host sets the real domain (TBD by owner, PR5).
- Scripts: `dev`, `build` (`run-s build-only type-check`), `build-only` (`vite-ssg build`), `preview`, `type-check`, `lint`, `prepare` (`husky && vite build --outDir node_modules/.cache/zcars-prepare --emptyOutDir`: install generates types/barrels/d.ts without leaving a fake `dist/`; TD1 + UC-X1), `clear:auto-generated`.
- `README.md` (DX-A1): quick start, scripts, content map (incl. `index.html` duplicates), images, deploy, troubleshooting, upgrading, ownership placeholder.
- Excluded (YAGNI): pinia, axios, corefront, storybook, msw, tiptap, contentful, stripe, socket.io, beasties (unless the TD-D3 font gate trips), error-monitoring SDK, analytics.

## Page (redesigned 2026-10-03; content and section order from `docs/reference/index.html`, layout no longer 1:1)

Sections in order: Nav (sticky, logo, 3 links, call CTA) · Hero (7/5 asymmetric split, eyebrow, H1, lead, 2 CTAs, service-tag index pinned to the bottom, full-height Montero photo with glass brand chip) · Partners (eyebrow + copy, full-bleed white logo marquee) · Services (numbered 01-03 index rows: title, description, tags, 16:10 thumbnail; icon tile on a dot grid when there is no photo) · Repaint (dark panel, parallax photo, Sand / Prime / Paint step strip) · Team (4:5 parallax portrait + visible caption, intro, hiring list with live dot) · Visit (large tap-to-call number, divided facts list, Google Maps iframe) · Footer (brand row, links, copyright, oversized clipped wordmark).

- Tokens: dark default + light via `prefers-color-scheme`, CSS variables mapped into Tailwind theme (named colors, no raw hex in templates); `spacing.nav` 68px token. Accent `#2563eb` / accent-text dark `#6b9bff` light `#1d4ed8`.
- Font: Archivo variable (wdth) self-hosted via `@fontsource-variable/archivo`; headings at `font-stretch: 125%`. No font preload (TD-D3: QA-gated on hero CLS > 0.1; fix path is `beasties`).
- Icons: `@phosphor-icons/vue`.
- Motion: `motion-v` only (peer `@vueuse/core` already installed), no hand-rolled animation. `MotionPlugin` registered in `main.ts` (global `v-motion`); `<MotionConfig reduced-motion="user">` in `App.vue`. Shared options in `src/utils/motion.ts`: `enter(delay)` (hero entrance, plays once) and `reveal(delay)` (`whileInView`, `once`, amount 0.15). Partners marquee is a `v-motion` infinite `x` loop; Repaint/Team photos use `BaseParallaxImage` (`useScroll` + `useTransform`, off under `useReducedMotion`). Hover/active micro-states stay as Tailwind `motion-safe:` utilities; smooth scroll only via CSS `motion-safe:scroll-smooth`.
- Behavior details: Address fact links to Google Maps directions (`MAP_DIRECTIONS_URL`, new tab); every linked fact underlined; map container has a pin + "Open in Google Maps" layer under the iframe (shown while loading or blocked); hero and team image frames `bg-surface`; `main#top` has `scroll-mt-nav` so the logo lands at scroll 0; global `:focus-visible` ring; `motion-safe:active:scale` on buttons; hover only on hover-capable devices; sr-only "(opens in new tab)" on external links; team caption visible; footer year in `<span data-allow-mismatch="text">`; `TService` is image XOR icon.
- SEO / share: title, description, `og:title`, `og:description`, `og:type`, `og:url` + `og:image` absolute via `%VITE_SITE_URL%`, `og:image:alt`, `twitter:card`, stable `public/og-image.webp` (copy of `montero.webp`), JSON-LD `AutoBodyShop` with `url` + `image`; favicon; `color-scheme` meta. One `<noscript><style>` rule in `index.html` forcing `[style*="opacity:0"]` visible (replaces UC-D1: `motion-v` prerenders initial `opacity:0` inline, so without it JS-off visitors get blank sections).
- Content is data-driven where it repeats (services, facts, nav, partners) in `src/types/<domain>.ts`; one-off copy stays inline in SFCs (listed in README).
- Zero em/en dashes in visible copy.

## Acceptance

- [ ] Fresh copy: `nvm use && npm install && cp .env.example .env.local && npm run dev` (README quick start, verbatim) reaches localhost in < 3 min with zero dev console warnings; install leaves no `dist/`; `npm run lint` + `npm run type-check` pass before any manual build
- [ ] `npm run build` exits 0 (vite-ssg build + `vue-tsc`), prints `[vite-ssg] Build finished.`; `npm run lint` 0 errors / 0 warnings; no `.vite-ssg-temp/` left
- [ ] `dist/index.html` is prerendered (H1, `id="top"`, `services`, `team`, `visit`, footer text) with absolute `og:image` / `og:url` from `VITE_SITE_URL`, `og:type`, `og:image:alt`, `twitter:card`, JSON-LD `url` + `image`; no literal `%VITE_SITE_URL%`, exactly one `<noscript>` (the motion reveal fallback), no Google Fonts / unpkg; `dist/og-image.webp` exists
- [ ] Build fails with the actionable DX-A2 message when `VITE_SITE_URL` is unset, and with the DX-A4 message when only `PHONE_HREF` (or `FACEBOOK_URL`) changes without `index.html`
- [ ] QA on `npm run build && npm run preview` (never dev): hero animates once; zero console errors/warnings; widths 320/390/768/1024/1440 with no page x-scroll; visual check of the redesign at 1440x900 and 390x844 (no 1:1 reference match); both color schemes AA (photo-overlay text >= 4.5:1, scrim per D-A15); reduced motion (opacity fades only, no movement, marquee and parallax static, no hidden blocks, no smooth scroll, no hover lift / active scale); JS off: full page readable (no element left at `opacity:0`); cold `/#visit` no blink; nav jump then Back returns to the prior position; logo click lands at 0; map blocked shows the fallback layer; throttled images show surface frames; one `montero` request; keyboard pass with a visible ring on every stop; touch: no sticky hover
- [ ] All links work: `tel:+639637457661`, FB page (3 places, new tab, sr-only notice), directions (new tab), in-page anchors
- [ ] `src/router.ts` absent; README present with the content map; `engines.node >=20`
- [ ] No `any`, no `as`, no hand-written imports of auto-imported symbols, no `.npmrc`, no commits, no test files

## Out of scope (approved)

Host/domain/deploy pipeline and CSP (PR5, owner TBD); opening hours, JSON-LD geo/streetAddress, Messenger m.me link, analytics (E6-E9, need verified facts/consent); og-image jpg fallback (only if FB debugger rejects webp post-deploy); srcset; 404 page; Renovate/CI; CMS/client self-edit; DESIGN.md.
