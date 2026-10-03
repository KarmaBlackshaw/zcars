# Scaffold (tooling + SSG app shell + README) Spec

> Round 2 (h09): applies the approved /autoplan amendments (`docs/research/autoplan-review.md`): UC1 vite-ssg, E-A1..E-A9, UC-E1, UC-D1, UC-X1, TD1, E2, D-A4, DX-A1..DX-A6.

## Overview

- **Target file:** `/Users/admin/Documents/personal/zcars/vite.config.ts` (plus the rest of the owned list)
- **Owned files (this builder only):**
  - `package.json`, `package-lock.json` (generated), `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.config.json`, `env.d.ts`
  - `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `postcss.config.js`, `.gitignore`, `.nvmrc`, `.husky/pre-commit`
  - `.env.example` (committed), `.env.local` (copied from `.env.example`, gitignored), `README.md`
  - `tailwind.config.js` (SHELL only; ownership passes to `design-tokens` in wave 1)
  - `src/assets/style.scss` (STUB only; ownership passes to `design-tokens` in wave 1)
  - `index.html`, `src/main.ts`, `src/App.vue`, `src/pages/index.vue`
  - `src/assets/images/*.webp` (copies), `public/favicon.png` (copy), `public/og-image.webp` (copy)
  - **NOT created:** `src/router.ts` (deleted from the plan, E-A1: vite-ssg creates the router)
- **Complexity:** `[high]`
- **Wave:** 0 · **Depends-on:** none

## Responsibility

Stand up a buildable, lint-clean, prerendering (vite-ssg) Vue 3 + TS project in `/Users/admin/Documents/personal/zcars` whose tooling mirrors `/Users/admin/Documents/winona/patient-dashboard-next`.

## Skills

- **Baked (do NOT re-invoke):** none (tooling; global Standards baked below).
- **Builder MUST invoke before coding:** none. On any verify failure use gstack `investigate` (root-cause, not retry).
- **QA emphasis (Phase 5, orchestrator):** gstack `health` (typecheck/lint/build, fresh-clone flow), gstack `qa` on `npm run build && npm run preview` (page loads at `/`, zero console errors/warnings, `dist/index.html` head checks, guard negative checks), gstack `review` (heavy lane: barrel plugin, `ssgOptions` hooks, eslint config).

## Public API

- **Inputs / props / events / slots:** N/A
- Contract for later waves: `npm run build` (vite-ssg prerender + type-check) and `npm run lint` work; components in `src/components/**` auto-register (`Base/Button.vue` → `BaseButton`, `Home/Services/index.vue` → `HomeServices`, `Home/Services/Cell.vue` → `HomeServicesCell`); `@/` alias → `src/`; barrels generated for `src/types`, `src/composables`, `src/utils`; `.env.local` exists so later builders' `npm run build` passes the guard.

## State & data

N/A. Excluded deps (YAGNI): pinia, axios, corefront, storybook, msw, `@unhead/vue` (transitive of vite-ssg, never listed), `beasties` (only if TD-D3 QA gate trips).

## Dependencies

**SHELL NOTE (builder machine only, never write this into README or any committed file):** `npm` is aliased via lean-ctx and `npm view` lies. Use `command npm install`, `command npm view <pkg> version`. Never copy the reference `.npmrc`; create none.

- **dependencies:** vue ^3.5.17, vue-router ^4.6.4, @vueuse/core ^12.8.2, @fontsource-variable/archivo ^5.3.0, @phosphor-icons/vue ^2.2.1
- **devDependencies:** vite ^6.0.11, vite-ssg ^28.3.0, @vitejs/plugin-vue ^5.2.1, vite-plugin-vue-devtools ^7.7.0, typescript ~5.7.3, vue-tsc ^2.2.0, @vue/tsconfig ^0.7.0, @types/node ^24.19.1, unplugin-vue-router ^0.19.2, unplugin-auto-import ^0.17.5, unplugin-vue-components ^28.4.1, tailwindcss ^3.4.17, postcss ^8.5.1, autoprefixer ^10.4.20, sass ^1.85.1, eslint ^9.14.0, @eslint/js ^9.14.0, globals ^15.0.0, eslint-plugin-vue ^9.32.0, @typescript-eslint/parser ^8.22.0, @typescript-eslint/eslint-plugin ^8.22.0, eslint-plugin-import ^2.32.0, eslint-import-resolver-typescript ^3.7.0, eslint-plugin-unused-imports ^4.4.1, eslint-plugin-prettier ^5.5.4, eslint-config-prettier ^10.1.8, prettier 3.6.2, prettier-plugin-tailwindcss ^0.6.11, husky ^9.1.7, lint-staged ^15.4.3, npm-run-all2 ^7.0.2
- Peer conflict: verify with `command npm view`, adjust the minimum; never `--force`.

## File-by-file

- **package.json:** `name: "zcars"`, `private: true`, `type: "module"`, `"engines": { "node": ">=20" }` (DX-A3). Scripts exactly:
  - `dev: vite` · `build: run-s build-only type-check` · `preview: vite preview` · `build-only: vite-ssg build`
  - `type-check: vue-tsc --noEmit -p tsconfig.app.json --composite false` · `lint: eslint . --max-warnings=0 --fix`
  - `prepare: husky && vite build --outDir node_modules/.cache/zcars-prepare --emptyOutDir` (TD1 + UC-X1: generates d.ts/barrels/`auto-import.json` on install, never leaves a fake `dist/`)
  - `clear:auto-generated: rm -rf src/types/index.ts src/composables/index.ts src/utils/index.ts ./auto-imports.d.ts ./components.d.ts ./typed-router.d.ts ./auto-import.json`
  - `lint-staged` block copied verbatim from the reference `package.json`.
- **vite.config.ts:** mirror the reference `/Users/admin/Documents/winona/patient-dashboard-next/vite.config.ts` with:
  - Inline plugin `{ name: "index-generator", async buildStart() {...} }` replacing corefront `generateIndex`: for each of `src/composables`, `src/types`, `src/utils`: skip if missing; `fs.promises.readdir`; keep `*.ts` except `index.ts` and `*.d.ts` (non-recursive); sort; none → write nothing; else `/* eslint-disable */\n/** This file is auto generated */\n\n` + `export * from "./<name>"` lines (no semicolons, `\n`-joined, trailing newline); write only if content differs. Await all dirs. (Runs in both vite-ssg passes; idempotent.)
  - Plugin order: index-generator, `VueRouter({ routesFolder: "src/pages" })`, `Vue()`, `VueDevTools()`, `AutoImport`, `Components`.
  - AutoImport: `dirs: ["./src/composables", "./src/utils"]`, `include` regexes as reference, `imports: ["vue", "vue-router", "@vueuse/core"]`, `vueTemplate: true`, `dts: true`, `eslintrc: { enabled: true, filepath: "./auto-import.json", globalsPropValue: true }`.
  - Components: `{ dts: true, deep: true, directoryAsNamespace: true, collapseSamePrefixes: true }`, no resolvers. Drop svgLoader.
  - `server.watch.ignored: ["**/src/{types,composables,utils}/index.ts"]`; alias `@` as reference.
  - `ssgOptions` (E-A2, DX-A2, DX-A4, DX-A6), declared as `const ssgOptions: ViteSSGOptions = {...}` with `import type { ViteSSGOptions } from "vite-ssg";` (annotation is load-bearing: types the hooks and pulls in vite-ssg's `UserConfig.ssgOptions` augmentation), passed as `ssgOptions` inside `defineConfig({...})`:
    - `onBeforePageRender(_route, indexHTML)`: if `indexHTML.includes("%VITE_SITE_URL%")` → `throw new Error(...)` with EXACTLY: `[zcars] VITE_SITE_URL is not set. index.html uses it for og:image, og:url and JSON-LD, and Vite leaves an unset variable as the literal "%VITE_SITE_URL%", so link previews would break. Fix: run "cp .env.example .env.local" for local builds, or set VITE_SITE_URL=https://<your-domain> (no trailing slash) in the host's build environment. Not needed for \`npm run dev\`. See README "Deploy".`Then, if`/\/\/(localhost|127\.0\.0\.1)/`matches`indexHTML`→`console.warn("[zcars] VITE_SITE_URL points at localhost. Fine for npm run preview; on the host set VITE_SITE_URL=https://<your-domain>.")` (warn, never throw: preview QA uses localhost).
    - `onPageRendered(_route, renderedHTML)` (DX-A4, head vs body drift; compare HTML to HTML, do NOT import `src/types` into the config, plain regex, no new dep, no `JSON.parse`): `telephone` = capture of `/"telephone":"([^"]+)"/`; `telHref` = capture of `/href="tel:([^"]+)"/`; if both found and differ → throw `[zcars] index.html head is out of sync with src/types/contact.ts: JSON-LD telephone "<telephone>" but the page links "tel:<telHref>". Update index.html (meta description + JSON-LD) to match contact.ts.` Same for `sameAs`: capture `/"sameAs":\["([^"]+)"/` vs `/href="(https:\/\/www\.facebook\.com\/[^"]+)"/`; on mismatch throw `[zcars] index.html head is out of sync with src/types/contact.ts: JSON-LD sameAs "<a>" but the page links "<b>". Update index.html JSON-LD sameAs to match contact.ts FACEBOOK_URL.` If the body link is absent (true in wave 0, before sections exist), skip that comparison.
    - Before writing the hooks, read the installed `node_modules/vite-ssg/dist/**/*.d.mts` to confirm the `ViteSSGOptions` export name and both hook signatures. If the return type requires a value, return the input HTML unchanged.
  - Zero comments (one short line above the barrel plugin only if truly needed).
- **tsconfig.json / tsconfig.config.json:** verbatim from reference.
- **tsconfig.app.json:** reference minus `@bywinona/*` paths, `.storybook/**/*`, `./plugins/*.ts`, the vueCompilerOptions comment block. Keep `@/*`, includes `env.d.ts`, `components.d.ts`, `auto-imports.d.ts`, `typed-router.d.ts`, `node_modules/unplugin-vue-router/client.d.ts`, `src/**/*`, `src/**/*.vue`.
- **env.d.ts:** only `/// <reference types="vite/client" />`.
- **eslint.config.js:** reference verbatim. `ignores`: reference list minus storybook/playground/`src/stores/index.ts`, plus `src/{types,composables,utils}/index.ts`, `docs/**`, `.gstack/**`, `.claude/**`, `**/.vite-ssg-temp/**` (E-A4). Keep `dist` ignored.
- **.prettierrc.json, .prettierignore, postcss.config.js:** verbatim from reference.
- **.gitignore:** reference minus storybook/github-prompts/figma/playwright entries; ignore generated files (`auto-import.json`, `auto-imports.d.ts`, `components.d.ts`, `typed-router.d.ts`, `src/{types,composables,utils}/index.ts`), `dist`, `node_modules`, `*.local` (covers `.env.local`; add if the reference lacks it), `.vite-ssg-temp` (E-A4), `.gstack`, `.claude`, `CLAUDE.local.md`. Do NOT ignore `docs` or `.env.example`.
- **.nvmrc:** `v24`. **.husky/pre-commit:** `npm run type-check && npx lint-staged --no-stash`.
- **.env.example** (DX-A2, exactly two lines):
  ```
  # Absolute site origin, no trailing slash. Used for og:image, og:url, JSON-LD. Host sets the real domain.
  VITE_SITE_URL=http://localhost:4173
  ```
- **.env.local:** `cp -n .env.example .env.local` (gitignored; lets every wave's `npm run build` pass the guard).
- **tailwind.config.js (shell):** `export default { content: ["./index.html", "./src/**/*.{vue,ts}"], theme: { extend: {} }, plugins: [] };` No prefix (wave 1 fills it).
- **src/assets/style.scss (stub):** `@tailwind base;\n@tailwind components;\n@tailwind utilities;` only.
- **index.html** (static head is the ONLY head source, E-A3; no `useHead` anywhere): `<html lang="en">`; head from `docs/reference/index.html` lines 3-20, with these exact changes:
  - Keep charset, viewport, `<title>`, `<meta name="description">`, `og:title`, `og:description`, JSON-LD (`name`, `telephone`, `address`, `sameAs` verbatim).
  - `og:image` → `%VITE_SITE_URL%/og-image.webp` (always; no conditional, E-A6). Add `<meta property="og:url" content="%VITE_SITE_URL%/">`, `<meta property="og:type" content="website">`, `<meta property="og:image:alt" content="Black Mitsubishi Montero Sport with a fresh, glossy detail outside the Zcars garage">`, `<meta name="twitter:card" content="summary_large_image">`.
  - JSON-LD: add `"url":"%VITE_SITE_URL%/"` and `"image":"%VITE_SITE_URL%/og-image.webp"` (keep it one line).
  - Preload: `<link rel="preload" as="image" href="/src/assets/images/montero.webp">` (Vite rewrites to the hashed asset). Icon: `<link rel="icon" href="/favicon.png">`. Add `<meta name="color-scheme" content="dark light">`.
  - REMOVE Google Fonts preconnects/stylesheet, unpkg Phosphor stylesheet, inline `<style>`, inline year/IO `<script>`. NO `<noscript>` (UC-D1: prerender supersedes it).
  - Body: `<div id="app"></div><script type="module" src="/src/main.ts"></script>`.
- **src/main.ts** (E-A1, exact; first confirm `node_modules/@fontsource-variable/archivo/wdth.css` exists with family `Archivo Variable`):

  ```ts
  import "@fontsource-variable/archivo/wdth.css";
  import "@/assets/style.scss";
  import { ViteSSG } from "vite-ssg";
  import { routes, handleHotUpdate } from "vue-router/auto-routes";

  import App from "./App.vue";

  export const createApp = ViteSSG(
    App,
    { routes },
    ({ router }) => {
      if (import.meta.hot) {
        handleHotUpdate(router);
      }
    },
    { hydration: import.meta.env.PROD, useHead: false }
  );
  ```

  `export const createApp` is mandatory (vite-ssg imports that name); it shadows the auto-imported `vue` `createApp` at module scope, which is allowed: do NOT add a `vue` import, do NOT rename. NO `scrollBehavior` (UC-E1: prerendered anchors scroll natively; scrollBehavior would break Back position). If lint flags `no-redeclare` here, fix with `["error", { builtinGlobals: false }]`, not a rename.

- **src/App.vue:** `<script setup lang="ts">defineOptions({ name: "App" });</script>` + `<template><RouterView /></template>`.
- **src/pages/index.vue** (later waves create the components; unresolved tags are expected to warn only in build/SSR now; if the SSR pass errors on them, root-cause with `investigate`):

  ```vue
  <script setup lang="ts">
  defineOptions({ name: "IndexPage" });
  </script>

  <template>
    <LayoutNav />
    <main id="top" class="scroll-mt-nav">
      <HomeHero />
      <HomePartners />
      <HomeServices />
      <HomeRepaint />
      <HomeTeam />
      <HomeVisit />
    </main>
    <LayoutFooter />
  </template>
  ```

  `scroll-mt-nav` (D-A4) resolves once design-tokens adds `spacing.nav` in wave 1; until then Tailwind emits nothing for it (expected).

- **Assets:** `cp` (not move) `docs/reference/assets/{collision,logo,montero,ojt,partners,polish,repaint}.webp` → `src/assets/images/`; `docs/reference/assets/favicon.png` → `public/favicon.png`; `docs/reference/assets/montero.webp` → `public/og-image.webp` (stable share URL, E2). Do NOT copy `crew-wash.webp`.
- **README.md** (DX-A1; write LAST; never copy the reference README; never mention the lean-ctx alias; under ~120 lines; paths/exports taken verbatim from the component specs). Sections in order:
  1. What it is: one line + `docs/reference/index.html` is the visual + copy contract.
  2. Prerequisites: Node 24 via `.nvmrc` (>=20 required, `engines`), npm.
  3. Quick start (copy-paste):
     ```
     nvm use
     npm install                   # also generates types, barrels, d.ts
     cp .env.example .env.local    # VITE_SITE_URL for local builds
     npm run dev                   # http://localhost:5173
     ```
  4. Scripts table: `dev` (HMR, no prerender), `build` (vite-ssg prerender + type-check), `preview` (serve `dist/`; use this to check production), `lint` (autofixes), `type-check`, `clear:auto-generated` then `build-only` to regenerate; note `prepare` builds into `node_modules/.cache/zcars-prepare` on install, so only `npm run build` output is deployable; note the pre-commit hook runs a full `type-check` (~10 s) then lint-staged.
  5. Edit content map (exact table from `autoplan-review.md` Phase 3.5 Pass 4: Phone, Facebook page, Business name, Map/directions, Services, Nav links, Partner names, Hero/repaint/team/hiring copy, Footer tagline, Share preview). Phone + Facebook rows say "build checks" the `index.html` duplicates. Renaming any `src/types/*.ts` export requires updating this table.
  6. Images: replace `src/assets/images/<name>.webp` and update `width`/`height` where the component lists them; `public/og-image.webp` is a separate copy for link previews.
  7. Deploy (host-agnostic): build command `npm run build`, output `dist`, env `VITE_SITE_URL=https://<your-domain>` (no trailing slash), Node from `.nvmrc`; devDependencies must be installed at build time (no `--omit=dev` / `NODE_ENV=production` on install); never copy `.env.example` on the host.
  8. Troubleshooting: `ENOENT ... auto-import.json` or `Cannot find module '@/types'` → `npm run build-only`; "VITE_SITE_URL is not set" → quick start step 3 / host env; "head is out of sync" → update `index.html` per the content map; added a file to `src/types`, `src/composables` or `src/utils` while dev runs → restart `npm run dev`.
  9. Upgrading: `npm outdated`; bump one group at a time (vite + plugins + vite-ssg; vue + vue-router + unplugin-vue-router; eslint group); after each `npm run clear:auto-generated && npm run build && npm run lint && npm run preview`; never `--force`.
  10. Ownership: placeholders for host, domain, and who to ask, left for the owner (no guessed values).

## Order of work

1. Write all files except README; copy assets (incl. `public/og-image.webp`). 2. `git init` (NEVER commit). 3. `cp -n .env.example .env.local`. 4. `cd /Users/admin/Documents/personal/zcars && command npm install` (runs `prepare`). 5. `test ! -d dist` (prepare left no fake dist) and generated d.ts / `auto-import.json` / `src/types` barrel exist (barrel only once a `src/types/*.ts` exists; fine if absent now). 6. Read vite-ssg `.d.mts` to confirm the `ssgOptions` hook signatures used. 7. Verify (below). 8. Guard negative check: `mv .env.local .env.local.bak && npm run build-only` must FAIL showing the DX-A2 text; `mv .env.local.bak .env.local`. 9. Write README.md. 10. `test -f .husky/_/pre-commit`, `test ! -f .npmrc`, `test ! -e src/router.ts`.

## Conventions checklist

- [ ] No `any`, no `as` (vite.config.ts included; regex captures via `?.[1]`, no `JSON.parse`)
- [ ] No hand-written imports of auto-imported symbols in `src/` (`createApp` export is the vite-ssg contract, not an import)
- [ ] async/await in the barrel plugin; no `.then` anywhere (the old bootstrap `.then` is gone)
- [ ] Bind regex results to named consts before branching (Standards §Code style)
- [ ] Zero comments by default (Standards §Comments)
- [ ] `console.warn` only for the localhost warning; errors throw
- [ ] No `.npmrc`, no commit, no test files; SHELL NOTE never leaks into README

## Acceptance criteria

- [ ] All owned files exist as specified; `src/router.ts` does not exist and `grep -r "createRouter" src` is empty
- [ ] `src/assets/images/` holds exactly 7 webp; `public/favicon.png` and `public/og-image.webp` exist (`og-image.webp` byte-identical to `docs/reference/assets/montero.webp`)
- [ ] `package.json`: `engines.node ">=20"`, `build-only` = `vite-ssg build`, `prepare` = `husky && vite build --outDir node_modules/.cache/zcars-prepare --emptyOutDir`, `vite-ssg ^28.3.0` in devDependencies, `vue ^3.5.17`, no `@unhead/vue` / `beasties` entries
- [ ] After `command npm install` on a tree with no build: no `dist/` exists; `npm run lint` and `npm run type-check` pass (prepare generated everything)
- [ ] `npm run build` exits 0 and prints `[vite-ssg] Build finished.`; `npm run lint` reports 0 errors / 0 warnings; `.vite-ssg-temp/` absent after success
- [ ] `dist/index.html` is prerendered (contains `<main id="top" class="scroll-mt-nav"`), has title, description, `og:title`, `og:description`, `og:type`, `og:image:alt`, `twitter:card`, `og:image` = `http://localhost:4173/og-image.webp`, `og:url` = `http://localhost:4173/`, JSON-LD with `url` + `image`, favicon, `color-scheme` meta; NO literal `%VITE_SITE_URL%`, NO `<noscript>`, NO fonts.googleapis / unpkg
- [ ] Build prints the localhost warning (DX-A6) with `.env.local` default value
- [ ] Build without `.env.local` fails with the exact DX-A2 message; `.env.example` has the format comment line
- [ ] `vite.config.ts` has the typed `ssgOptions` with both hooks; DX-A4 drift check skips when no body link exists (its negative check runs in QA after wave 2)
- [ ] README has all 10 sections, the 4-command quick start, the content map, and no lean-ctx mention
- [ ] `.gitignore` covers `*.local`, `.vite-ssg-temp`, `dist`, generated files; eslint ignores `**/.vite-ssg-temp/**`
- [ ] `.husky/_/pre-commit` exists; `git log` shows no commits; no `.npmrc`
- [ ] Every Conventions box satisfied; verify passes clean

## Verify

- `cd /Users/admin/Documents/personal/zcars && cp -n .env.example .env.local; npm run build && npm run lint`
