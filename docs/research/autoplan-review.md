<!-- /autoplan restore point: /Users/admin/.gstack/projects/zcars/nobranch-autoplan-restore-20261003-205511.md -->

# /autoplan Review: Zcars Vue port

Plan under review: docs/research/zcars-vue.spec.md + docs/research/components/\*.spec.md
Voices: subagent-only (codex unavailable: not a git repo / no binary)

## Phase 1: CEO Review

Mode: SELECTIVE EXPANSION (auto-decided). Voice: Claude primary + Claude subagent pass (codex unavailable). Source read-only; no code changes.

### System audit (pre-review)

- Project root `/Users/admin/Documents/personal/zcars` is not a git repo yet; contains only `docs/` and `.gstack/` (the latter holds `terminal-internal-token`, `browse*.log`; must stay gitignored and undeployed, which the scaffold `.gitignore` already covers).
- No CLAUDE.md, TODOS.md, DESIGN.md, or design doc in the project. Retrospective check: no history.
- Reference repo `patient-dashboard-next` checked: `eslint.config.js` reads `./auto-import.json` synchronously at load; `.gitignore` ignores all generated d.ts/barrels; `vite-plugin-vue-devtools` is a devDependency but NOT in its `vite.config.ts` plugin list (the spec adds it; harmless, dev-only).
- Taste calibration. Good patterns to keep: reference `vite.config.ts` awaited `buildStart` barrel generation (fixes cold CI build), and the component-spec ownership partitioning (no file touched by two builders). Anti-patterns to avoid: synchronous read of a gitignored generated file inside `eslint.config.js` (cold-clone crash), and reveal-by-JS that hides content until a script runs.
- Landscape (in-distribution knowledge, no search): Layer 1, local service businesses win on Google Business Profile + click-to-call + fast static pages. Layer 2 skipped. Layer 3, the reference already IS the tried-and-true artifact; the port's value is owner maintainability, not user value, so the review hunts for regressions the SPA introduces versus the static page.
- UI scope: YES (Section 11 runs).

### 0A. Premise challenge

1. Right problem? The user outcome (people in Tacloban find Zcars and call / message / visit) is already met by the verified static page. This plan solves a maintainability problem for the owner-developer. That is legitimate, but it means every change the port makes must be regression-neutral for visitors. The review therefore weights regressions (JS-dependent rendering, deep-link scroll, link previews) above tooling polish.
2. Most direct path? For maintainability alone, yes: Vue + the owner's daily conventions. For visitor outcome, the most direct path also needs a host + domain, which the plan never names.
3. Do nothing? The static page ships today. Cost of nothing: hand-edited HTML/CSS drifts from the owner's conventions; low pain, but real for a client the owner will keep maintaining.

Premises (for the human gate, not decided here):

| #   | Premise                                                                                 | Stated or assumed      | Recommendation                                                                                                                    |
| --- | --------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| PR1 | `docs/reference/index.html` is the correct design + content contract                    | Stated                 | Accept. Caveat: content currency ("We're hiring", partner list) should be confirmed by the shop owner before launch.              |
| PR2 | Porting to Vue is worth it because the owner maintains it in their daily stack          | Stated (user decision) | Accept. Value is maintainability only; visitors gain nothing, so zero regressions is the bar.                                     |
| PR3 | Full tooling mirror (husky, lint-staged, barrel generator, typed router) is right-sized | Stated (user decision) | Accept as decided. Cost noted, not challenged: custom barrel plugin + router for a 1-route site.                                  |
| PR4 | A client-side-rendered SPA is acceptable for a local-SEO landing page                   | Assumed                | Challenge (see UC1): prerender to static HTML at build time.                                                                      |
| PR5 | Hosting, domain and deploy are outside this plan                                        | Assumed                | Reject. og:image needs an absolute URL; FB/Messenger previews are this business's main channel. Decide host + domain before ship. |
| PR6 | No automated tests; build + lint + browse QA suffices                                   | Stated                 | Accept for a static brochure (build fails on broken barrels/types). Revisit if logic grows.                                       |
| PR7 | Content is developer-edited (constants in `src/types`); the client never self-edits     | Assumed                | Accept for v1; TODO if the client asks for self-service.                                                                          |

### 0B. Existing code leverage map

| Sub-problem          | Existing code                                                | Reused?                                                 |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| Visual design + copy | `docs/reference/index.html`                                  | Yes, verbatim contract                                  |
| Images, favicon      | `docs/reference/assets/*.webp`, `favicon.png`                | Yes, copied (crew-wash.webp correctly excluded: unused) |
| Toolchain config     | `patient-dashboard-next` vite/eslint/prettier/tsconfig/husky | Yes, mirrored minus corefront/storybook/private deps    |
| Barrel generation    | corefront `generateIndex` (private package)                  | Rebuilt inline; justified, the package is private       |
| Scroll reveal        | reference inline IntersectionObserver script                 | Ported as `vReveal` directive (same semantics)          |
| Icons                | Phosphor webfont from unpkg                                  | Replaced by `@phosphor-icons/vue` (tree-shaken, no CDN) |
| Fonts                | Google Fonts CSS                                             | Replaced by `@fontsource-variable/archivo` self-hosted  |

Nothing is rebuilt that could be reused, except the barrel generator (forced by private package).

### 0C. Dream state

```
  CURRENT STATE                    THIS PLAN                           12-MONTH IDEAL
  Static index.html, verified,  -> Vue 3 + TS SPA, owner's toolchain, -> Prerendered static site on a
  hand-written CSS, CDN fonts      Tailwind tokens, data-driven         named domain; rich link previews;
  + icons, not deployed            content, still not deployed,         directions + hours + Messenger
                                   content rendered only by JS          CTAs; JSON-LD complete; call-click
                                                                        metric; owner edits content in one
                                                                        file; GBP listing linked
```

Direction: toward the ideal on maintainability; sideways-to-backward on visitor resilience (JS-only content, cold-load anchor scroll). The UC1 + mechanical fixes below close that gap.

### 0C-bis. Implementation alternatives

| Approach                                         | Summary                                                                        | Effort                                                         | Risk | Pros                                                                        | Cons                                                                                                         | Reuses                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------- | ---- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------- |
| A. Plan as written + hardening (minimal viable)  | Ship the 5 specs, add noscript, stable og image, scrollBehavior, lazy observer | S                                                              | Med  | Smallest diff from approved specs; respects full mirror                     | Content still JS-rendered; LCP waits on JS                                                                   | Everything in 0B           |
| B. A + build-time prerender (ideal architecture) | Same components; `vite-ssg` emits static HTML for `/`; client hydrates         | M (about 4 files: package.json, main.ts, router.ts, reveal.ts) | Med  | Static-page parity for SEO, no-JS, deep links, LCP; still Vue + owner stack | Departs from mirrored `main.ts` bootstrap; new dep; reveal classes added on hydrate can flash in-view blocks | Same components, unchanged |
| C. Keep static HTML, skip Vue                    | Deploy `docs/reference/index.html` as is                                       | XS                                                             | Low  | Already verified, zero JS                                                   | Rejects user's explicit Vue + mirror decision                                                                | Reference only             |

RECOMMENDATION: A as the baseline (auto-decided, P6), with B surfaced as User Challenge UC1 because it alters the mirrored bootstrap the user asked for. C is listed for completeness only; it contradicts a stated user decision and is not recommended.

### 0D. Scope analysis (SELECTIVE EXPANSION)

Complexity check: about 30 files, 0 services, 1 directive, 8 SFC sections + 3 base primitives. File count is high but most are config mirrors the user explicitly requested; the component layer is lean. No smell beyond the barrel generator serving two empty dirs (`src/composables`, `src/utils`), accepted per PR3.

Minimum set achieving the goal: scaffold + tokens + content/base + 9 section SFCs. Nothing deferrable without breaking 1:1 parity.

10x check: the site becomes the shop's booking front door: Messenger deep link with a prefilled "I'd like a quote for..." message, before/after gallery fed from FB posts, Google reviews strip, "Open now" badge from real hours, call-click metric so the owner can show the client the site pays for itself. Platform potential: the typed-content + section-primitive pattern is reusable for the owner's next local-business client (a starter template).

Expansion candidates (cherry-pick ceremony, auto-decided per P1/P2):

| #   | Candidate                                                                                                                              | Effort                       | Risk                                      | Decision                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------- | --------------------------- |
| E1  | `<noscript>` block in `index.html` with name, phone `tel:` link, FB link                                                               | S, 1 file                    | Low                                       | Accept (Mechanical, P2)     |
| E2  | Stable `public/og-image.webp` always (drop the conditional), add `og:type=website`, `og:image:alt`, `twitter:card=summary_large_image` | S, 2 files                   | Low                                       | Accept (Mechanical, P5)     |
| E3  | Router `scrollBehavior` (savedPosition, else `{ el: to.hash }`, else top) so cold-load `/#visit` lands on Visit                        | S, 1 file                    | Low                                       | Accept (Mechanical, P1)     |
| E4  | Address fact links to Google Maps directions (opens new tab); doubles as map-iframe failure fallback                                   | S, data only in `contact.ts` | Low, but deviates from 1:1 contract       | Taste TD2, recommend accept |
| E5  | Prerender via `vite-ssg`                                                                                                               | M, about 4 files             | Med                                       | User Challenge UC1          |
| E6  | Opening hours fact + JSON-LD `openingHours`                                                                                            | S                            | Needs real data (never guess)             | Defer to TODOS              |
| E7  | JSON-LD `url`, `image`, `geo`, `streetAddress`                                                                                         | S                            | Needs domain + verified address           | Defer to TODOS              |
| E8  | Messenger `m.me` link with prefilled text                                                                                              | S                            | Page-username unverified (profile.php id) | Defer to TODOS              |
| E9  | Privacy-friendly analytics + `tel:` click event                                                                                        | S-M                          | Needs host + client consent               | Defer to TODOS              |

### 0E. Temporal interrogation

```
  HOUR 1 (foundations):  Which node/npm actually installs? (`.nvmrc` v24; `command npm` alias note in scaffold spec is load-bearing.)
                         Does `@fontsource-variable/archivo/wdth.css` exist with family "Archivo Variable"? (spec says verify; good)
  HOUR 2-3 (core):       Directive hook order: Vue sets `class` props before `beforeMount`, so classList.add there survives. OK.
                         `bg-bg/[.82]` needs `<alpha-value>` var colors. Spec covers it.
  HOUR 4-5 (integration):Cold-clone surprise: `npm run lint` crashes (ENOENT auto-import.json) and pre-commit
                         `type-check` fails (`@/types` barrel missing) until one build runs. (TD1)
                         og:image hashed path changes every build; FB caches by URL. (E2)
                         Plain `<a href="#x">` + vue-router history: native scroll works; cold-load hash does not. (E3)
  HOUR 6+ (polish/QA):   Where is it deployed, under what domain? Nothing in the plan. (PR5)
```

Human: about 6h; CC: about 30-45 min. Decisions above are resolved in this review except PR5/UC1 (gate).

### 0F. Mode

SELECTIVE EXPANSION (given by orchestrator, consistent with default for "feature enhancement of an existing artifact"). Approach A baseline under this mode; B pending UC1.

### Section 1: Architecture

```
  index.html (meta, JSON-LD, noscript[E1])
        |
     main.ts --> fontsource wdth.css, style.scss (tokens), router.ts (scrollBehavior[E3]) --> App.vue --> pages/index.vue
                                                                                                   |
        +---------------+-------------+--------------+-------------+-----------+-----------+------+------+
        LayoutNav     HomeHero    HomePartners   HomeServices    HomeRepaint  HomeTeam   HomeVisit   LayoutFooter
                                                  +-Cell x3                    +-Hiring     +-iframe(Google Maps)
        all consume: BaseContainer / BaseButton / BaseEyebrow, "@/types" constants, vReveal, @phosphor-icons/vue
  build-time: index-generator -> src/types/index.ts ; unplugin-* -> *.d.ts, auto-import.json (read by eslint.config.js)
```

Data flow: one static flow, constants -> templates. Nil/empty paths: `SERVICES`, `VISIT_FACTS`, `NAV_LINKS` are compile-time constants typed non-optional, so nil/empty cannot occur at runtime; `TService.image`/`icon` both optional means a service with neither renders a plain cell with no icon (`component :is="undefined"` renders nothing). Acceptable, but the type allows an invalid state; a discriminated union (`{ image } | { icon }`) makes it unrepresentable. Logged as Mechanical (P5).
State machine: reveal per element: `hidden -> (intersect >= 0.15) -> shown`, terminal; unobserve after. Reduced motion: no hidden state at all. Invalid transition `shown -> hidden` prevented by unobserve.
Coupling: sections couple to `@/types` and Base primitives only. Fine.
Scaling / SPOF: static assets on a CDN; SPOF is the JS bundle (content invisible if it fails) and the Google Maps legacy `output=embed` endpoint. Both addressed (E1, UC1, E4).
Rollback: static host redeploy of previous build (seconds). No data.
Beautiful version: B (prerender) makes the Vue layer a pure authoring convenience with static-page runtime behavior: "clever and obvious".

### Section 2: Error & Rescue Map

```
  CODEPATH                    | WHAT CAN GO WRONG                          | ERROR
  ----------------------------|--------------------------------------------|----------------------------
  main.ts bootstrap           | JS disabled / blocked / old browser        | page blank (no exception)
                              | runtime error in a section setup           | Vue error, partial/blank render
  index-generator (buildStart)| fs.readdir/writeFile fails                 | build error (loud) OK
  eslint.config.js load       | auto-import.json missing (cold clone)      | ENOENT, lint crashes
  vue-tsc (pre-commit)        | barrels/d.ts missing (cold clone)          | TS2307 Cannot find module '@/types'
  reveal.ts                   | IntersectionObserver undefined (SSR/Node)  | ReferenceError at import
  Map iframe                  | Google legacy embed endpoint changes/blocked| empty surface box, silent
  og:image                    | relative/hashed URL                        | FB preview without image, silent
  Hash deep link (cold load)  | content not mounted when browser scrolls   | lands at top, silent

  ERROR                      | RESCUED? | ACTION                                        | USER SEES
  ---------------------------|----------|-----------------------------------------------|------------------------
  page blank (no JS)         | N <- GAP | E1 noscript fallback; UC1 prerender           | name + phone + FB link
  section runtime error      | N <- GAP | UC1 (static HTML survives); QA zero console   | blank region
  ENOENT auto-import.json    | N <- GAP | TD1 cold-start generation                     | dev only
  TS2307 '@/types'           | N <- GAP | TD1                                           | dev only (commit blocked)
  ReferenceError IO          | N <- GAP | lazy observer creation (Mechanical)           | n/a unless SSR/tests
  map iframe failure         | N <- GAP | E4 directions link beside it                  | link still works
  og:image broken            | N <- GAP | E2 stable public path + absolute URL at deploy| proper preview
  cold-load hash             | N <- GAP | E3 scrollBehavior / UC1                       | correct section
```

No catch-all handlers in plan (good). No app-level `errorHandler`; not added (YAGNI for a static site; `console.error` default is enough).

### Section 3: Security & threat model

- Attack surface: no inputs, no forms, no APIs, no auth. Only third-party surface: Google Maps iframe and FB links. Likelihood Low / impact Low.
- External links use `rel="noopener"`; fine (modern browsers imply it with `_blank` anyway).
- Secrets: `.npmrc` copy explicitly forbidden (good). `.gstack/terminal-internal-token` sits in project root: gitignored by spec; Vite never serves it (only `public/` + bundle). OK.
- Dependencies: about 35 devDeps, all mainstream; lockfile generated. Supply-chain risk Low-Med, mitigated by lockfile. `vite-plugin-vue-devtools` is serve-only.
- Data: only the business's public phone/address. No PII.
- Optional hardening (deploy-time, host headers): CSP allowing `frame-src https://www.google.com`. Deferred with PR5.
  No High findings.

### Section 4: Data flow & interaction edge cases

```
  CONSTANTS(src/types) --> TEMPLATE --> DOM --> vReveal(IO) --> visible
       |                                   |          |
   [image+icon both absent? -> empty cell]  [JS off?]  [IO never fires: element taller than 1/0.15 viewports? no: largest is team figure]
```

| Interaction         | Edge case                                  | Handled?      | How                                                                     |
| ------------------- | ------------------------------------------ | ------------- | ----------------------------------------------------------------------- |
| Nav anchor click    | back button after jump                     | Yes           | native; verify in QA                                                    |
| Cold load `/#visit` | content mounts after browser anchor scroll | No -> E3      | scrollBehavior / prerender                                              |
| Call CTA            | desktop without tel handler                | Yes           | number visible in label (hidden only <=480px, where phones handle tel:) |
| Partners panel      | 390px width                                | Yes           | internal x-scroll, focusable region                                     |
| Map                 | slow 3G / blocked                          | Partial -> E4 | lazy iframe + directions link                                           |
| Reveal              | reduced motion                             | Yes           | all `motion-safe:`                                                      |
| Reveal              | fast scroll past element                   | Yes           | IO fires on any intersection, once                                      |
| Footer year         | cached page across new year                | Yes           | computed at runtime                                                     |
| Hero LCP            | slow 3G                                    | Partial       | image preload kept; text waits on JS unless UC1                         |

### Section 5: Code quality

- `TService` optional `image` + optional `icon` allows an invalid "neither" state; make it a union. Mechanical (P5).
- Barrel generator dirs `src/composables`, `src/utils` will be empty; generator correctly writes nothing. Accepted per PR3.
- `vite-plugin-vue-devtools` added to plugin list though the reference config omits it; keep (dev-only), Mechanical (P3).
- Partners sentence built from `PARTNER_NAMES` in script (DRY with the list) while the alt text repeats names by hand; acceptable (alt text intentionally differs: "MTX Microtex", "Rocci Automotive Refinish").
- No over-engineering in the component layer; Base primitives are consumer-agnostic and minimal. No method exceeds 5 branches.

### Section 6: Tests

```
  NEW UX FLOWS:       nav anchors; call CTA; FB links (new tab); map view; reveal on scroll; hero entrance
  NEW DATA FLOWS:     constants -> templates (static)
  NEW CODEPATHS:      Cell photo vs plain variant; Visit fact link vs text; reveal hidden->shown; barrel generator
  ASYNC WORK:         IntersectionObserver callbacks; router.isReady bootstrap
  INTEGRATIONS:       Google Maps iframe; Facebook URLs; tel:
  ERROR PATHS:        see Section 2
```

Coverage in plan: build (type-check catches type/barrel breaks), lint, gstack browse visual diff at 1440 and 390, QA phase (qa, design-review, health). No unit/E2E files by design (PR6). 2am-Friday test: browse loads `/`, `/#visit` cold, toggles color scheme + reduced motion, zero console errors, `dist/index.html` contains OG + JSON-LD + noscript. Hostile QA: JS disabled; 320px width; light mode contrast on service photo overlays. Flakiness: map iframe is external; exclude from pass/fail. Gap: add those cases to the QA checklist (Mechanical, no test framework).

### Section 7: Performance

- No DB/queries. Payload: vue + vue-router + used icons, roughly 60-70 KB gz JS; Archivo variable latin subset; images 15-144 KB webp, all sized (no CLS). Hero image preloaded.
- Slowest paths: (1) first paint of text waits on JS parse + mount (UC1 fixes); (2) `ojt.webp` 144 KB lazy; (3) Maps iframe (lazy, third party).
- Font preload skipped (fontsource hashed URL needs a plugin); `font-display: swap` default. Not in scope.

### Section 8: Observability

For a static brochure the meaningful signal is "did the site produce calls/messages". Plan has none. Runtime JS errors are invisible to the owner. Decisions: no error-monitoring SDK (YAGNI); analytics + tel-click event deferred (E9) pending host + client consent. Day-1 operability: host deploy log + uptime of a static page. Gap logged, not a blocker.

### Section 9: Deployment & rollout

**WARNING**: no host, domain, CI, or deploy step anywhere in the specs (PR5). Consequences: og:image/og:url cannot be absolute; JSON-LD lacks `url`; nothing verifies `dist/` post-deploy. Rollback on any static host = redeploy previous build. Post-deploy checklist (once host exists): load `/`, `/#visit`, FB Sharing Debugger on the URL, Google Rich Results test for JSON-LD. Migrations/flags: none. Recommend deciding host + domain at the gate; Netlify is a natural fit (connector available), but that is the user's call.

### Section 10: Long-term trajectory

- Debt: custom barrel plugin (owned code replacing a private package); typed router + auto-import for one route; enterprise lint/hook stack on a brochure with likely-infrequent upgrades (eslint, unplugin majors). Accepted per PR3.
- Path dependency: low; components are plain SFCs, portable to Astro/vite-ssg later.
- Knowledge: no README; the client cannot self-edit. Content lives in five small typed files, which is easy for the owner.
- Reversibility: 4/5.
- 1-year read: obvious to a Vue dev; the barrel generator and `directoryAsNamespace` naming need a one-line explanation somewhere.
- Phase 2: hours, Messenger, analytics, JSON-LD enrichment, gallery (TODOS). Platform potential: starter template for the owner's next local-business site.

### Section 11: Design & UX

IA: brand + call CTA (sticky) -> promise (hero) -> trust (partners) -> what we do (services) -> proof of craft (repaint) -> people (team, hiring) -> where (visit) -> footer. Correct order for a local service shop: call first, location last but always one tap away via the sticky CTA.

| Feature    | Loading                      | Empty | Error                            | Success   | Partial |
| ---------- | ---------------------------- | ----- | -------------------------------- | --------- | ------- |
| Page shell | blank until JS (GAP: E1/UC1) | n/a   | blank (GAP)                      | full page | n/a     |
| Images     | sized boxes, lazy            | n/a   | alt text                         | photo     | n/a     |
| Map        | surface panel                | n/a   | empty panel (GAP: E4)            | map       | n/a     |
| Reveal     | hidden until IO              | n/a   | stays hidden if IO missing (Low) | visible   | n/a     |

```
  [Land /] -> scroll -> [Services] -> [Team] -> [Visit: map + facts]
     |                                              |
     +--(sticky Call CTA, any point)--> tel: dialer  +--> FB (new tab) / directions (E4)
  [Land /#visit cold] --E3/UC1--> [Visit]
```

AI slop risk: low; design is a verified, specific reference. Responsive: explicit 390 and 1440 checks; nav links hidden <900px (mobile users scroll; CTA stays). Accessibility: icons `aria-hidden`, focusable partners region, focus-visible ring, AA check in both schemes, iframe title, sr-only CTA label at <=480px. Delight (30-min): E1 noscript, E2 preview polish, E3 deep links, E4 directions. Recommend running /plan-design-review next for the deep pass.

### CLAUDE SUBAGENT (CEO: strategic independence)

Fresh-perspective pass, answering cold:

1. Right problem? Partly. The plan optimizes the developer's experience; none of its acceptance criteria measure whether more people call the shop. Severity: Medium. Fix: add outcome items (E1-E4) and decide deploy (PR5) so the work reaches a visitor at all.
2. Premises stated vs assumed? Assumed: it will be hosted somewhere with a domain; JS-rendered content is fine for local SEO; the reference copy is still current; the client never edits. Severity: High for hosting (blocks link previews, the shop's main channel). Fix: gate PR4, PR5, PR7 explicitly.
3. 6-month regret? A brochure page carrying an enterprise toolchain that nobody upgrades; first `npm install` after a long gap fails on a peer conflict, and the owner edits the HTML by hand again. Severity: Medium. Fix: lockfile committed, `.nvmrc` pinned (both in plan); accept the rest per user decision.
4. Alternatives dismissed? Astro (static by default, can render Vue components) and vite-ssg were never considered; both give static-page runtime with Vue authoring. Severity: Medium. Fix: UC1 (vite-ssg is the smaller step from this plan).
5. Competitive risk? Local competitors are mostly FB-only; the real local-search lever is the Google Business Profile listing and reviews, not the site. A fast site linked from a complete GBP listing wins "car detailing Tacloban". Severity: Low-Med. Fix: TODO to confirm the GBP listing exists and link it (address/directions fact, JSON-LD `sameAs`).

### Decisions for the gate

Taste decisions (auto-recommended, user may override):

- **TD1 cold-clone generation.** `eslint.config.js` (mirrored) reads gitignored `auto-import.json` at load, and `vue-tsc` needs the gitignored `src/types/index.ts`; on a fresh clone `npm run lint` crashes (ENOENT) and the husky pre-commit `type-check` fails until a build runs. Options: (a) `"prepare": "husky && vite build"` so install generates everything (recommended, 1 line, P3); (b) `existsSync` guard in eslint config (diverges from verbatim mirror, still breaks type-check); (c) document "run build-only once".
- **TD2 directions link.** Give the Address fact an `href` to Google Maps (external, new tab). Pure data change (`TVisitFact` already supports `href`/`isExternal`), doubles as map-iframe failure fallback, but deviates from the 1:1 contract (address becomes an underlined link). Recommend accept (P1).

User challenges (never auto-decided):

- **UC1 prerender.** Add `vite-ssg` so `/` ships as static HTML and hydrates. Fixes blank-without-JS, cold-load deep links and JS-gated first paint in one move, keeps every component unchanged. Changes the mirrored `main.ts` bootstrap and adds a non-mirror dependency, hence a challenge to "full mirror". Requires lazy observer in `reveal.ts` (T4) and accepts a brief re-reveal of blocks already in view at hydration. Recommend accept.

Premise gate: PR1-PR7 above; PR4 and PR5 need an answer before ship.

### NOT in scope

- Font preload plugin: swap default is fine; add if CLS/FOUT shows in QA.
- Error-monitoring SDK (Sentry etc.): YAGNI for a static page.
- Analytics / call tracking (E9): needs host + client consent.
- Opening hours (E6), JSON-LD enrichment (E7), Messenger m.me link (E8): need verified facts; never guess.
- CMS / client self-editing: no request yet.
- Gallery / reviews strip (10x vision): future phase.
- Removing the router / barrel tooling: user chose full mirror.
- Unit/E2E test framework: PR6.

### What already exists

See 0B. The plan reuses the reference page, assets, and the reference toolchain; it rebuilds only the private corefront barrel generator.

### Error & Rescue Registry

| Codepath         | Failure                 | Rescued (after decisions)    | Action                | User impact                   |
| ---------------- | ----------------------- | ---------------------------- | --------------------- | ----------------------------- |
| Bootstrap        | JS off/blocked          | Partial (E1), full if UC1    | noscript / prerender  | contact info always reachable |
| Section setup    | runtime error           | Only if UC1                  | static HTML           | blank region otherwise        |
| eslint load      | ENOENT auto-import.json | Pending TD1                  | cold-start generation | dev only                      |
| vue-tsc          | TS2307 '@/types'        | Pending TD1                  | cold-start generation | dev only                      |
| reveal.ts        | IO undefined at import  | Yes                          | lazy observer         | none                          |
| Map iframe       | endpoint down           | Partial (E4)                 | directions link       | can still navigate            |
| og:image         | relative/hashed         | Partial (E2), full after PR5 | stable + absolute URL | proper share preview          |
| Cold hash        | lands at top            | Yes (E3)                     | scrollBehavior        | correct section               |
| Barrel generator | fs error                | Yes                          | build fails loudly    | none (dev)                    |

### Failure Modes Registry

```
  CODEPATH        | FAILURE MODE              | RESCUED? | TEST?        | USER SEES?        | LOGGED?
  ----------------|---------------------------|----------|--------------|-------------------|--------
  bootstrap       | JS off                    | E1       | QA (add)     | noscript contacts | n/a
  bootstrap       | runtime error             | N (UC1)  | QA console   | blank region      | console only
  og:image        | no preview image          | E2+PR5   | FB debugger  | Silent today      | N  <- CRITICAL GAP until PR5
  map iframe      | embed endpoint gone       | E4       | N (external) | empty panel+link  | N
  cold hash       | wrong scroll              | E3       | QA (add)     | correct section   | n/a
  eslint/vue-tsc  | cold clone crash          | TD1      | N            | dev only          | stderr
  reveal          | IO missing                | lazy     | build        | content hidden    | N (Low)
```

1 CRITICAL GAP (og:image silent failure) remains open until PR5 (host + domain) is decided.

### Dream state delta

After this plan + accepted items: owner-maintainable Vue site with static-page parity on look, a noscript safety net, correct deep links, stable share image, and a directions CTA. Still missing vs the 12-month ideal: prerendered HTML (UC1), deployment + domain (PR5), hours, Messenger deep link, complete JSON-LD, outcome metric, GBP linkage.

### Implementation Tasks

- [ ] **T1 (P1, human: ~15min / CC: ~3min)** scaffold: add `<noscript>` with name, `tel:` link, FB link to `index.html` (E1). Verify: `dist/index.html` contains it.
- [ ] **T2 (P1, human: ~15min / CC: ~3min)** scaffold: always copy `montero.webp` to `public/og-image.webp`; add `og:type`, `og:image:alt`, `twitter:card` (E2). Absolute URL once PR5 decided.
- [ ] **T3 (P1, human: ~20min / CC: ~3min)** scaffold: `router.ts` `scrollBehavior` (saved position, else hash el, else top) (E3). Verify: browse cold-load `/#visit`.
- [ ] **T4 (P2, human: ~15min / CC: ~3min)** design-tokens: create the IntersectionObserver lazily on first `mounted`, not at module import. Verify: build + reveal works.
- [ ] **T5 (P2, human: ~15min / CC: ~3min)** content-and-base: `TService` as union (`image` xor `icon`). Verify: type-check.
- [ ] **T6 (P2, pending TD1)** scaffold: cold-clone generation so `lint`/`type-check` work before first build.
- [ ] **T7 (P2, pending TD2)** content-and-base + sections-bottom: address fact links to Google Maps directions.
- [ ] **T8 (P2)** QA checklist: JS-disabled load, cold `/#visit`, 320px width, both schemes, reduced motion, zero console errors.
- [ ] **T9 (P1 for ship, pending PR5/UC1)** decide host + domain; prerender if UC1 accepted.

JSONL artifact and gstack review-log not written: this subagent is restricted to writing this file only.

### Completion Summary

```
  +====================================================================+
  |            MEGA PLAN REVIEW - COMPLETION SUMMARY                   |
  +====================================================================+
  | Mode selected        | SELECTIVE EXPANSION                          |
  | System Audit         | not a git repo; eslint reads gitignored json |
  | Step 0               | Approach A baseline; B = UC1; 7 premises     |
  | Section 1  (Arch)    | 2 issues (JS SPOF, TService invalid state)   |
  | Section 2  (Errors)  | 9 error paths mapped, 8 GAPS (6 closed)      |
  | Section 3  (Security)| 0 issues, 0 High                             |
  | Section 4  (Data/UX) | 9 edge cases mapped, 3 unhandled -> fixed    |
  | Section 5  (Quality) | 2 issues                                     |
  | Section 6  (Tests)   | Diagram produced, 1 gap (QA checklist)       |
  | Section 7  (Perf)    | 1 issue (JS-gated first paint -> UC1)        |
  | Section 8  (Observ)  | 1 gap (no outcome metric, deferred)          |
  | Section 9  (Deploy)  | 1 risk flagged (no host/domain)              |
  | Section 10 (Future)  | Reversibility: 4/5, debt items: 3            |
  | Section 11 (Design)  | 3 issues (blank-on-no-JS, map fail, deep link)|
  +--------------------------------------------------------------------+
  | NOT in scope         | written (8 items)                            |
  | What already exists  | written                                      |
  | Dream state delta    | written                                      |
  | Error/rescue registry| 9 codepaths, 1 CRITICAL GAP (og:image)       |
  | Failure modes        | 7 total, 1 CRITICAL GAP                      |
  | TODOS.md updates     | 6 items proposed (E6-E9, GBP, client edit)   |
  | Scope proposals      | 9 proposed, 4 accepted/recommended, 4 deferred, 1 UC |
  | CEO plan             | inlined here (no ~/.gstack write)            |
  | Outside voice        | skipped per orchestrator; subagent pass inline|
  | Lake Score           | 6/7 recommendations chose complete option    |
  | Diagrams produced    | 5 (architecture, data flow, state, error, user flow) |
  | Stale diagrams found | 0                                            |
  | Unresolved decisions | 2 UC/premise gates (UC1, PR5) + 2 taste      |
  +====================================================================+
```

## Phase 2: Design Review

Method: gstack /plan-design-review, all 7 passes at full depth, auto-decided (P1-P6; design tiebreak P5+P1). Voices: Claude primary + Claude subagent (independent). Codex: unavailable (not a git repo; orchestrator marked it unavailable). Source read-only; spec files NOT edited; every fix below is a plan Amendment for the builders to apply.

Baseline: specs as written PLUS the approved gate items (vite-ssg prerender, VITE_SITE_URL absolute OG/JSON-LD, stable `public/og-image.webp`, Address -> Google Maps directions, noscript fallback, router scrollBehavior, visible team caption, reduced-motion gating of hover transforms + smooth scroll, nav landmark, CTA label sr-only <=480px, focusable partners region).

### Pre-review audit

- UI scope: YES, the whole deliverable is one landing page (8 sections, 3 base primitives, 1 directive).
- DESIGN.md: none. The de facto design system is `docs/reference/index.html` (visual contract) + `components/design-tokens.spec.md` (tokens). Recommendation: do NOT run /design-consultation; the design is locked 1:1 and a parallel DESIGN.md would be a second source of truth (P4). Gap noted, not actioned.
- Prior design reviews / learnings: none (gstack learnings search empty, no git history).
- Existing leverage: reference CSS maps rule-for-rule to Tailwind classes in the section specs; Base primitives (Container/Button/Eyebrow) are the only shared vocabulary, all consumer-agnostic.

### Step 0

- **0A rating: 7/10.** Unusually specific for a plan: every class, copy string, alt text, breakpoint and token is named, because a verified page exists. It loses points on states, not visuals: no spec for map loading/failure, image failure, hydration behavior of `vReveal` under the newly approved prerender, scroll landing under the sticky header, or focus visibility on non-link focusables. A 10 here = the same 1:1 visual spec plus an explicit state table, a keyboard/focus map, and hydration-safe motion.
- **0B:** no DESIGN.md, universal principles + reference contract used.
- **0D focus:** all 7 passes (auto, P1).
- **Step 0.5 mockups: skipped deliberately.** Designer binary is present, but the reference page IS the approved mockup; generating variant directions against a locked 1:1 contract would invite drift (P5, P3). Visual verification stays where the specs put it: browse side-by-side at build time + /design-review in QA.

### Pass 1: Information Architecture: 8/10 -> 9/10

First / second / third, per viewport:

```
  390x844 first viewport                      1440x900 first viewport
  +----------------------------------+        +---------------------------------------------------+
  | (logo) Zcars            [phone]  | 1      | (logo) Zcars   Services Team Visit  [Call 0963..] | 1
  |----------------------------------|        |---------------------------------------------------|
  | PIN SAGKAHAN, TACLOBAN CITY      | 3      | PIN SAGKAHAN, TACLOBAN CITY   |                   |
  | Paint, protection and shine.     | 2      | Paint, protection and shine.  |   Montero photo   | 2 (photo = anchor)
  | One shop.                        |        | One shop.                     |   4:5, rounded    |
  | lead                             |        | lead                          |                   |
  | [Call 0963 745 7661] [See serv.] | 1b     | [Call ...] [See services]     |                   |
  +----------------------------------+        +---------------------------------------------------+
  (photo below fold on mobile)
  Then: partners (trust) -> services bento -> repaint band (craft proof) -> team + hiring -> visit (facts + map) -> footer
```

- Hierarchy is right for a garage: the call action is in the first viewport at both sizes and sticky thereafter; location is the eyebrow; the promise is the H1. Constraint test (only 3 things): phone, what we do, where. All three are above the fold or one tap away.
- Issue 1.1 (structural, auto-fixed): brand link `href="#top"` targets `main#top`, which starts 68px down (below the in-flow sticky header). Clicking the logo at page top scrolls DOWN 68px, and from anywhere it lands with the hero eyebrow hidden under the header (hero pt-12 = 48px < 68px). Reference bug, invisible in screenshots. -> Amendment D-A4.
- Mobile has no section links (nav links `hidden desk:block`). Kept: reference decision, page is short, call CTA persists (subtraction default).

### Pass 2: Interaction State Coverage: 4/10 -> 8/10

```
  FEATURE            | LOADING                          | EMPTY | ERROR                               | SUCCESS            | PARTIAL
  -------------------|----------------------------------|-------|-------------------------------------|--------------------|---------------------------
  Page shell (SSG)   | static HTML paints before JS     | n/a   | JS fails: page stays fully readable  | hydrated           | n/a
  Hero image         | surface-colored 4:5 frame (D-A3) | n/a   | alt text on surface frame (D-A3)     | photo              | n/a
  Service photo cell | bg-surface + scrim + copy        | n/a   | alt text, copy still on scrim        | photo              | n/a
  Team image         | surface 16:9 frame (D-A3)        | n/a   | alt on surface; caption stays        | photo + caption    | n/a
  Map                | pin + "Open in Google Maps" (D-A2)| n/a  | same layer stays visible (D-A2)      | live map covers it | n/a
  Reveal blocks      | in-view at mount: visible (D-A1) | n/a   | no IO / no JS: visible               | fade-rise once     | n/a
  Fonts              | system-ui fallback, swap         | n/a   | fallback persists                    | Archivo 125% wdth  | heading reflow on swap (TD-D3)
  tel:/FB links      | n/a                              | n/a   | desktop w/o tel handler: number visible in label | dialer / new tab | n/a
```

Issues found (all auto-fixed as amendments unless marked):

- 2.1 Map iframe has no loading or failure state. Blocked (privacy extension, corporate network, Google endpoint change) = a silent 380px empty box. -> D-A2.
- 2.2 Hero figure and team image wrapper have no background; a slow or failed image is a hole with stray alt text. -> D-A3.
- 2.3 Hydration flash: with prerender, server HTML has no reveal classes (visible); `vReveal` then adds `opacity-0` on the client. Any block already in view at hydration (cold `/#visit`, refresh mid-page, back-forward restore) blinks out and fades back in. Phase 1 "accepted a brief re-reveal"; on reflection it is a visible defect on the exact deep-link path E3 exists to fix (P1). -> D-A1.
- 2.4 noscript block now duplicates content: with prerender a no-JS visitor already sees the full page, so the approved `<noscript>` contact block renders a second copy of name/phone/FB. -> USER CHALLENGE UC-D1 (approved item, not auto-decided).
- 2.5 Footer year under SSG: static HTML carries the build year; hydration corrects it on the client. Acceptable, documented (D-A11), no code.

### Pass 3: User Journey & Emotional Arc: 6/10 -> 8/10

```
  STEP | USER DOES                              | USER FEELS                      | PLAN SPECIFIES?
  -----|----------------------------------------|---------------------------------|-----------------------------------------
  1    | Taps FB/Messenger share link            | "is this legit?"                | YES: absolute og:image + title (gate)
  2    | Lands, 390px, slow 4G                   | oriented in <3s (place, promise)| YES with SSG; hero anim is CSS, pre-JS
  3    | Scans headlines                         | "they do my thing"              | YES: 5 scannable H2s, tags per service
  4    | Sees repaint band, team/OJT             | trust, craft, local roots       | YES
  5    | Wants to call                           | low friction                    | YES: sticky CTA, 44px+ target
  6    | Wants to visit                          | "how do I get there?"           | YES after TD2 (directions); D-A2 if map blocked
  7    | Taps logo to return to top              | expects top                     | NO -> D-A4
  8    | Shares /#visit with a friend            | friend lands on Visit           | PARTIAL: E3 + D-A1 (no blink), D-A4 offset
  9    | Returns months later                    | same site, current year         | YES (D-A11)
```

- 5-second (visceral): dark, photographic, confident; matches the reference. 5-minute (behavioral): call and directions both one tap. 5-year (reflective): content is typed constants, so copy stays current only if the owner edits it (PR1 caveat on hiring/partners).
- Break points fixed: logo-to-top (D-A4), deep-link blink (D-A1), map dead-end (D-A2).

### Pass 4: AI Slop Risk: 8/10 -> 8/10

- Classifier: MARKETING/LANDING. Specificity is high (named tokens, exact clamp sizes, Archivo variable at 125% width, real photos of the actual shop, verbatim local copy "Alagang Zcars!"). No vague "clean modern" language anywhere.
- Blacklist: no purple gradients, no icon-in-circle 3-column grid (bento of real photos + one plain cell), not centered-everything, no blobs, no emoji, no left-border cards, no generic hero copy, font is not system-ui. Uniform 14px radius on every surface (blacklist 5) is mild and is the reference's choice: kept.
- Hard-rule deviations, all inherited from the verified reference and kept (contract beats generic rules, P5): hero is split + rounded, not full-bleed; H1 is the promise, not the brand. Not challenged: local-service pages convert on "what + where + call", and the user verified this design.
- No new findings; nothing to fix.

### Pass 5: Design System Alignment: 7/10 -> 8/10

- No DESIGN.md (flagged above, deliberately not created).
- 5.1 The 68px header height is a magic number in 2 specs (`h-[68px]` in LayoutNav, `calc(100dvh-68px)` in HomeHero) and D-A4 would add a third. -> D-A8 `spacing.nav` token.
- 5.2 Focus ring is scoped to `a:focus-visible` only (design-tokens spec line 60), so the approved focusable partners region (`tabindex="0"` div) gets only the UA ring, inconsistent with every other control. -> D-A5.
- 5.3 Naming collision: color token `ghost` (#c3cad6, muted-on-dark) vs `BaseButton variant="ghost"`. Implementers will read `text-ghost` as "ghost button text". Kept (color-name.com rule), flagged in Pass 7 so builders are warned.
- New components fit the vocabulary: none introduced beyond the spec'd Base trio.

### Pass 6: Responsive & Accessibility: 7/10 -> 9/10

- Breakpoints are intentional, not "stack on mobile": 480 (CTA icon-only, label sr-only), 768 (gutter 16->32, hiring row 3-col), 900 (`desk:` nav links, hero split, bento 2x2, band split, visit split). Partners strip scrolls inside its panel (no page x-scroll).
- Touch targets: nav CTA about 44px tall (py-2.5 + 15px\*1.6); hero buttons about 53px; footer link 32px (min-h-6 py-1) meets WCAG 2.5.8 AA 24px; inline fact links about 26px, AA. OK.
- Contrast (computed from tokens): muted on bg 8.8:1 dark / 7.1:1 light; accent-text 7.0:1 dark / 6.2:1 light; white on accent 5.2:1. Text over photos depends on imagery: QA gate already allows raising the scrim stop.
- Landmarks/outline: header > nav[aria-label=Primary], main, footer; one H1, H2 per section, H3 per card. Partners section has aria-label instead of a heading (reference). Skip link: not needed (2-5 tab stops before main; `main` landmark satisfies bypass via ARIA11).
- 6.1 `active:scale-[.98]` on BaseButton is an ungated transform; the approved reduced-motion gating covered hover only. -> D-A6.
- 6.2 Router scroll must not force smooth: if `scrollBehavior` returns `behavior: "smooth"`, reduced-motion users get smooth scroll on deep links despite `motion-safe:scroll-smooth`. -> D-A7.
- 6.3 Sticky hover on touch: Tailwind 3 `hover:` is not media-gated, so a tapped button stays lifted/darkened on phones. -> TASTE TD-D1.
- 6.4 New-tab links (3 Facebook + directions) give no warning to screen-reader users. -> TASTE TD-D2.
- 6.5 Partners region is a tab stop even at >=900px where it does not scroll (approved a11y item). Kept: harmless, and making it conditional needs JS (YAGNI).
- QA viewports: specs only check 390 and 1440. -> D-A10 adds 320, 768, 1024.

### Pass 7: Unresolved Design Decisions

```
  DECISION NEEDED                                  | IF DEFERRED, WHAT HAPPENS                                   | RESOLUTION
  -------------------------------------------------|-------------------------------------------------------------|-------------------
  Map loading / blocked state                      | 380px empty box, visitor stuck                              | D-A2 (auto)
  Reveal behavior at hydration                     | in-view blocks blink on deep links and refresh              | D-A1 (auto)
  Logo / #top landing under sticky header          | logo click scrolls DOWN 68px, eyebrow hidden                | D-A4 (auto)
  Exact directions URL + link text for Address     | two builders invent two URL shapes                          | D-A9 (auto)
  Focus ring scope                                 | region/iframe neighbors get UA ring, inconsistent           | D-A5 (auto)
  Smooth scroll source (CSS vs router)             | reduced motion broken on deep links                         | D-A7 (auto)
  Image failure frame color                        | holes with stray alt text                                   | D-A3 (auto)
  `ghost` color vs ghost button name               | wrong class reached for                                     | warn only (D-A12)
  noscript block under prerender                   | duplicated contact block for no-JS visitors                 | UC-D1 (user)
  hover on touch devices                           | sticky lifted buttons after tap                             | TD-D1 (taste)
  new-tab announcement                             | SR users surprised by new tab                               | TD-D2 (taste)
  font swap reflow at 125% width                   | visible H1 reflow on first paint now that HTML is static    | TD-D3 (taste)
```

### Amendments (auto-decided; builders apply, specs unchanged)

- **D-A1 (design-tokens, `reveal.ts`)** Do all work in `mounted(el)`: if `el.getBoundingClientRect().top < window.innerHeight`, do nothing (element stays visible, no animation); otherwise add the transition + hidden classes and observe. Drop the `beforeMount` class add. Compatible with the lazy observer (T4). Below-fold elements are offscreen when hidden, so no flash. Verify: cold-load `/#visit` and refresh mid-page show no blink.
- **D-A2 (sections-bottom, `Visit.vue`)** Map container becomes `relative` with a layer beneath the iframe: `absolute inset-0 grid place-items-center` containing `PhMapPin` (aria-hidden) + link "Open in Google Maps" (`MAP_DIRECTIONS_URL`, new tab, underline, `text-muted`). Iframe gets `relative` so a loaded map paints over it. Visible only while the map loads or when it is blocked. Verify: block `google.com` in browse, the panel shows the link.
- **D-A3 (sections-top `Hero.vue`, sections-bottom `Team/index.vue`)** Add `bg-surface` to the hero `figure` and the team image wrapper `div`. Invisible once the image paints (object-cover fills the box).
- **D-A4 (scaffold `pages/index.vue`)** `main#top` gets `scroll-mt-nav` (68px, via D-A8) so `#top` resolves to scroll 0. Verify in browse: click the logo at page top (no movement) and from Visit (lands at 0). If router scrollBehavior ignores scroll-margin on cold `/#top`, return `{ top: 0 }` for that hash.
- **D-A5 (design-tokens `style.scss`)** Base focus rule selector `a:focus-visible` -> `:focus-visible` (same outline utilities). Covers the partners region and any future control.
- **D-A6 (content-and-base `Button.vue`)** `active:scale-[.98]` -> `motion-safe:active:scale-[.98]`.
- **D-A7 (scaffold `router.ts`)** `scrollBehavior` returns `savedPosition`, else `{ el: to.hash }`, else `{ top: 0 }`, with NO `behavior` key; CSS `motion-safe:scroll-smooth` on `html` decides smoothness.
- **D-A8 (design-tokens `tailwind.config.js`)** Add `spacing.nav: "68px"`; consumers use `h-nav`, `min-h-[calc(100dvh-theme(spacing.nav))]`, `scroll-mt-nav`.
- **D-A9 (content-and-base `contact.ts`)** Add `MAP_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=Zcars+Auto+Detailing+Garage%2C+Sagkahan%2C+Tacloban+City"` (Google Maps URLs API). Address fact: `href: MAP_DIRECTIONS_URL, isExternal: true`, text unchanged. Reused by D-A2.
- **D-A10 (QA checklist, extends T8)** Add viewports 320, 768, 1024; Google-blocked map; image-throttled load (frames show surface); cold `/#visit` with no blink; logo click at top; full keyboard tab pass with a visible ring on every stop (brand, desk links, CTA, hero CTAs, partners region, hiring FB, 3 fact links, iframe, footer link); network shows ONE `montero` request (preload href matches img src).
- **D-A11 (docs only)** Footer year in prerendered HTML is the build year; client hydration sets the current year. Accepted, no code.
- **D-A12 (builder note)** `text-ghost` is the muted-on-dark color (#c3cad6), unrelated to `BaseButton variant="ghost"`. The only dynamic `:class` near `v-reveal` is the Services cell `desk:row-span-2`, which is fixed per item (`SERVICES` is constant), so it is never re-patched and does not wipe the directive's classes.
- **D-A13 (cross-phase, scaffold `main.ts`/`router.ts`)** The approved vite-ssg changes the `main.ts` and `router.ts` entries (`ViteSSG(App, { routes, scrollBehavior })` replaces `createApp` + `isReady().then(mount)`). Design requires only that D-A7 scrollBehavior and D-A1 survive that rewrite. Phase 3 (Eng) owns the exact bootstrap.
- **D-A14 (sections-bottom `Visit.vue`)** Underline rule becomes "every fact with `href`" (Address, Phone, Facebook), not "the two fact links".
- **D-A15 (sections-top `Services/Cell.vue`)** Overlay escape hatch gets a threshold: if text over a photo is below 4.5:1, raise the scrim to `from-40%`, then re-check. Do not go past `from-50%` without a design-review.

### Taste decisions (auto-recommended; user may override)

- **TD-D1 hover only on hover-capable devices.** Enable Tailwind 3 `future.hoverOnlyWhenSupported: true` (verify the flag in the installed Tailwind version before use) so hover lift/color does not stick after a tap. Recommend accept (P1); departs from the reference's plain `:hover` only on touch screens.
- **TD-D2 new-tab announcement.** Append `<span class="sr-only"> (opens in new tab)</span>` inside the 4 external links (Hiring button slot, FB fact, directions fact, footer). Zero visual change. Recommend accept (P1).
- **TD-D3 font preload.** Prerender makes the system-ui -> Archivo 125% swap visible on first paint (H1 reflow). Recommend: keep deferred (CEO #19), but gate it in QA: if hero CLS > 0.1 or the reflow is visible on throttled 4G, add a preload for the latin wdth woff2 (verify the exact fontsource file name in node_modules first). P3.
- **TD-D4 eyebrow to Visit link (subagent).** Making the hero eyebrow "Sagkahan, Tacloban City" a `#visit` link would give mobile users a way to reach Visit. Recommend reject (P5): an eyebrow that is a link without looking like one breaks "clickable must look clickable", and underlining it changes the hero. Mobile users already have the sticky Call button, and TD2 puts directions in Visit.
- **Owner content notes (not builder work, logged with PR1):** opening hours (E6), team copy saying OJT work is supervised, and whether a customer CTA belongs between hero and Visit.
- **Kept as-is (contract):** split rounded hero instead of full-bleed, H1 = promise not brand, hover zoom on non-clickable service cells, uniform 14px radius, full-width Hiring button on mobile (grid stretch, identical in reference).

### User challenges (not auto-decided)

- **UC-D1 noscript under prerender.** The approved `<noscript>` contact block was decided (E1) before prerender (UC1) was accepted. With vite-ssg the no-JS page is already complete, so the block becomes a duplicate name/phone/FB block for no-JS visitors and a second NAP copy for crawlers. Recommendation: drop E1 / T1 (zero cost; prerender supersedes it). Alternative: keep it as a safety net in case prerender is ever removed. User decides.

### NOT in scope (design)

- DESIGN.md / /design-consultation: design is locked to the reference; one source of truth.
- Mockup generation: reference page is the approved visual.
- Visited-link color distinction: single-page tel/FB links; reference has none.
- Print styles for unrevealed blocks: no print use case.
- Mobile section links / hamburger: reference decision; page is short; CTA is sticky.
- Dark-themed map: Google embed cannot be themed without the paid JS API.
- Skip link: landmarks satisfy bypass; 2-5 tab stops before main.

### What already exists

`docs/reference/index.html` (visual + copy contract, verified), `design-tokens.spec.md` (token layer), Base Container/Button/Eyebrow (shared vocabulary), `vReveal` (single motion primitive), `TVisitFact.href/isExternal` (already supports the directions link without a type change).

### CLAUDE SUBAGENT (design: independent review)

Fresh pass by a separate subagent that had not seen this review. Summary, with how each point was handled:

- **Hierarchy.** Calls are handled well at both 390 and 1440. Visits are weaker: (a) there are no opening hours, even though the copy says "call ahead" [High]; (b) on mobile, Visit is the 7th block and the nav has no links [Medium]. Handling: (a) is CEO E6, deferred because hours need real data from the owner. Both voices agree it is the top content gap for the owner. (b) becomes TD-D4.
- **Missing states.** Four of these match this review independently:
  - reveal hydration flash: High, agrees with D-A1;
  - blocked Maps iframe: High, agrees with D-A2;
  - image failure frame: Medium, agrees with D-A3;
  - noscript is redundant under prerender: agrees with UC-D1.
  - The font-swap reflow is rated Medium there, with "preload now". This review rates it TD-D3, measured in QA first. The two voices disagree on timing, not on the risk.
  - Footer year mismatch on Jan 1 [Medium]: kept as D-A11 (accepted; Vue's production build patches the text quietly). Setting the year in `onMounted` instead is allowed if dev warnings bother the builder.
- **Journey.** The team/OJT section could make customers worry about students working on their car; the lead could say the work is supervised [Medium]. There is also no customer CTA mid-page; the only mid-page button is the hiring "Message us" [Medium]. Both are owner content decisions under the 1:1 contract. They are logged for owner review alongside PR1, and builders must not change them.
- **Specificity.**
  - [Critical, cross-phase] `scaffold.spec.md` lines 56-57 still describe `createApp(...).use(router)` plus `isReady().then(mount)`. That bootstrap is incompatible with the approved vite-ssg (`ViteSSG(App, { routes, scrollBehavior })`). Logged as D-A13, for Phase 3 (Eng) to specify.
  - [High] The Address link URL was not specified. Agrees with D-A9.
- **Ambiguities.**
  - The absolute OG/JSON-LD domain was not specified [Critical]. The gate already resolved this (VITE_SITE_URL plus a stable `public/og-image.webp`). The leftover either/or wording at `scaffold.spec.md:55` is superseded by E2.
  - "All consumers are static" in the reveal note, while the Services cell takes a `:class`. Clarified in D-A12.
  - The underline rule covers only "the two fact links". Fixed in D-A14.
  - The gradient escape hatch has no threshold. Fixed in D-A15.

### Design litmus scorecard

```
  DESIGN OUTSIDE VOICES - LITMUS SCORECARD  [single-model: Codex unavailable]
  ===============================================================
  Check                                    Claude-primary  Claude-subagent  Consensus
  ---------------------------------------  --------------  ---------------  ---------
  1. Brand unmistakable in first screen?   PARTIAL         PARTIAL          CONFIRMED (logo+name small; H1 = promise; kept, contract)
  2. One strong visual anchor?             YES             YES              CONFIRMED (Montero photo; below fold at 390)
  3. Scannable by headlines only?          YES             YES              CONFIRMED (5 concrete H2s)
  4. Each section has one job?             YES             YES              CONFIRMED
  5. Cards actually necessary?             YES (mostly)    NOT SPEC'D       plain service cell is the weakest card; kept
  6. Motion improves hierarchy?            YES             YES*             CONFIRMED (*after D-A1 removes hydration blink)
  7. Premium without decorative shadows?   YES             YES              CONFIRMED (no shadows used)
  ---------------------------------------  --------------  ---------------  ---------
  Hard rejections triggered:               none            none             CONFIRMED
  ===============================================================
```

### Implementation Tasks (Phase 2)

- [ ] **T10 (P1, human: ~20min / CC: ~3min)** design-tokens: reveal in-view check in `mounted` (D-A1). Verify: cold `/#visit`, no blink.
- [ ] **T11 (P1, human: ~20min / CC: ~3min)** sections-bottom: map loading/blocked layer (D-A2) + directions constant (D-A9, content-and-base). Verify: block google.com in browse.
- [ ] **T12 (P2, human: ~10min / CC: ~2min)** sections-top + sections-bottom: `bg-surface` image frames (D-A3).
- [ ] **T13 (P1, human: ~15min / CC: ~2min)** scaffold + design-tokens: `spacing.nav`, `scroll-mt-nav` on `main#top`, scrollBehavior without `behavior` (D-A4, D-A7, D-A8). Verify: logo click at top does not move.
- [ ] **T14 (P2, human: ~10min / CC: ~2min)** design-tokens + content-and-base: `:focus-visible` base rule, gated active scale (D-A5, D-A6).
- [ ] **T15 (P2)** QA checklist additions (D-A10), underline every fact link (D-A14), scrim threshold (D-A15).
- [ ] **T16 (pending TD-D1/TD-D2/UC-D1)** hover-only flag, sr-only new-tab text, noscript removal.

JSONL artifact and gstack review-log not written: restricted to writing this file only.

### Completion Summary (Phase 2)

```
  +====================================================================+
  |         DESIGN PLAN REVIEW - COMPLETION SUMMARY                    |
  +====================================================================+
  | System Audit         | no DESIGN.md (reference = DS); UI scope full |
  | Step 0               | 7/10; all 7 passes; mockups skipped (locked) |
  | Pass 1  (Info Arch)  | 8/10 -> 9/10                                 |
  | Pass 2  (States)     | 4/10 -> 8/10                                 |
  | Pass 3  (Journey)    | 6/10 -> 8/10                                 |
  | Pass 4  (AI Slop)    | 8/10 -> 8/10                                 |
  | Pass 5  (Design Sys) | 7/10 -> 8/10                                 |
  | Pass 6  (Responsive) | 7/10 -> 9/10                                 |
  | Pass 7  (Decisions)  | 16 surfaced: 11 resolved, 4 taste, 1 UC      |
  +--------------------------------------------------------------------+
  | NOT in scope         | written (7 items)                            |
  | What already exists  | written                                      |
  | TODOS.md updates     | 0 new (font preload stays QA-gated)          |
  | Approved Mockups     | 0 generated (reference is the mockup)        |
  | Decisions made       | 15 amendments added (D-A1..D-A15)            |
  | Decisions deferred   | 4 taste + 1 user challenge                   |
  | Overall design score | 7/10 -> 8.5/10                               |
  +====================================================================+
```

## Phase 3: Eng Review

Method: gstack /plan-eng-review at full depth (Step 0 + Sections 1-4 + required outputs), auto-decided (P1-P6; eng tiebreak P5+P3). Voices: Claude primary + Claude subagent (independent). Codex: unavailable. Source read-only; spec files NOT edited; every fix is an "Amendment for <spec>" for builders.

Baseline: specs + binding gate decisions (vite-ssg prerender UC1; VITE_SITE_URL for absolute og/JSON-LD + stable `public/og-image.webp`; `"prepare": "husky && vite build"`; Address -> `MAP_DIRECTIONS_URL`; noscript DROPPED (UC-D1); TD-D1 accept, TD-D2 accept, TD-D3 deferred, TD-D4 reject) + Phase 1/2 mechanical amendments (T1-T16, D-A1..D-A15).

### Verified facts (read from real packages, not memory)

| Fact                                                                                                                                                                                                                                                                                                                  | Source                                                      | Confidence |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- |
| `vite-ssg` latest 28.3.0; peers `vite ^2..^8` (6 OK), `vue ^3.2.10`, `vue-router ^4.0.1 \|\| ^5` (optional); `beasties`, `prettier` optional peers; deps include `@unhead/vue ^2`, `jsdom ^28`; node >=20                                                                                                             | `command npm view vite-ssg`                                 | 10         |
| Signature `ViteSSG(App, routerOptions, fn?, options?)`; `RouterOptions = Partial<'history'> & { base? }`; client options `{ hydration?: boolean (default false), useHead?: boolean (default true), registerComponents, rootContainer, transformState }`                                                               | `vite-ssg/dist/index.d.mts`, `shared/*.d.mts`               | 10         |
| With `hydration: false` (default) the client uses `createApp(App)` and `app.mount("#app", true)`, which on a non-SSR app is a full re-render that replaces the prerendered DOM                                                                                                                                        | `vite-ssg/dist/index.mjs`                                   | 10         |
| `vite-ssg build` imports the SSR entry and destructures `createApp` from it: the export MUST be named `createApp`                                                                                                                                                                                                     | `shared/vite-ssg.D5Fdxh1E.mjs:1419`                         | 10         |
| Build runs client build, then SSR build into `<root>/.vite-ssg-temp/<rand>` (removed on success, left on failure); output `dist/index.html` (dirStyle flat); `ssgOptions` defaults: `formatting: "none"`, `dirStyle: "flat"`, `mock: false`, `includedRoutes` filters dynamic routes; beasties used only if installed | same file :1350-1500                                        | 10         |
| `ssgOptions.onBeforePageRender(route, indexHTML, ctx)` receives the built `dist/index.html` string                                                                                                                                                                                                                    | same file :1452                                             | 10         |
| Vite 6 replaces `%NAME%` across the whole index.html string (works inside JSON-LD `<script>` and `<meta content>`); an unset `VITE_*` key logs a warning and is LEFT LITERAL                                                                                                                                          | `vite/dist/node/chunks/dep-*.js` `htmlEnvHook` (vite 6.2.1) | 10         |
| Tailwind 3.4.17: `hoverOnlyWhenSupported` is a `future` flag -> `future: { hoverOnlyWhenSupported: true }`, emits `@media (hover: hover) and (pointer: fine)`                                                                                                                                                         | `tailwindcss/lib/featureFlags.js:37`, `corePlugins.js:204`  | 10         |
| husky 9: no `.git` -> prints ".git can't be found", exits 0 (so `husky && vite build` still builds)                                                                                                                                                                                                                   | `husky/index.js`, `bin.js`                                  | 10         |
| vue-router sets `history.scrollRestoration = "manual"` whenever `scrollBehavior` is provided; native `#hash` clicks fire popstate -> router navigation -> `scrollBehavior` runs again                                                                                                                                 | `vue-router.mjs:3104, 575-605, 3643`                        | 9          |
| Vue 3.5 prod hydration text mismatch logs `console.error("Hydration completed but contains mismatches.")`; `data-allow-mismatch` attr suppresses it                                                                                                                                                                   | `@vue/runtime-core` prod build :1173, :1606                 | 10         |
| `@phosphor-icons/vue` 2.2.1: ESM, `sideEffects: false`, icons use `inject`/`computed` only, no window/document                                                                                                                                                                                                        | package tarball                                             | 9          |
| `@fontsource-variable/archivo` 5.3.0 `wdth.css` family `Archivo Variable`, `font-stretch: 62% 125%`, `font-display: swap`; latin wdth woff2 = 90 KB                                                                                                                                                                   | package tarball                                             | 10         |
| `unplugin-vue-router` 0.19.2 peers `vue-router ^4.6.0`, `@vue/compiler-sfc ^3.5.17`; exports `routes`, `handleHotUpdate` from `vue-router/auto-routes`                                                                                                                                                                | reference `node_modules`                                    | 10         |
| `@typescript-eslint/no-redeclare` builtin check applies only to global-scope variables; a module-scope `export const createApp` is a separate variable, not flagged                                                                                                                                                   | `no-redeclare.js:56-62, 186-196`                            | 8          |

### Step 0: Scope Challenge

1. **Existing code per sub-problem (real mapping).**

| Sub-problem                 | Existing code                                                                               | Plan reuses?                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bootstrap                   | reference `src/main.ts` (`createApp(App).use(pinia).use(router)` + `isReady().then(mount)`) | Replaced: vite-ssg owns app + router creation. Mirror kept everywhere else                                                                                |
| Router                      | reference `src/router.ts` (createRouter + middlewares + handleHotUpdate)                    | Becomes dead under vite-ssg (router created inside `ViteSSG`). DELETE `src/router.ts`, move the 3-line `handleHotUpdate` into the ViteSSG setup fn (E-A1) |
| Head/meta                   | static `docs/reference/index.html` head                                                     | Reuse as the ONLY head source; `@unhead/vue` (bundled by vite-ssg) disabled with `useHead: false` (E-A3)                                                  |
| Barrels                     | reference `vite.config.ts` awaited `buildStart` generation                                  | Reused shape, runs in both vite-ssg passes, idempotent (writes only on diff)                                                                              |
| Cold-clone generation       | none in reference (reference devs build once by habit)                                      | Gate: `prepare: husky && vite build`                                                                                                                      |
| Absolute URLs               | Vite built-in `%ENV%` html replacement                                                      | Reused (Layer 1), no plugin                                                                                                                               |
| Critical CSS / font preload | `beasties` (vite-ssg optional peer, auto-enabled if installed, `preloadFonts: true`)        | Not installed now; the documented upgrade path if TD-D3's QA gate trips (Layer 1, no hand-written preload)                                                |
| Scroll to hash on cold load | Browser native anchor scroll, now that HTML is prerendered                                  | E3/D-A7 `scrollBehavior` is superseded: UC-E1                                                                                                             |

2. **Minimum change set for the gate decisions:** `package.json` (scripts + `vite-ssg` devDep), `src/main.ts` (ViteSSG), delete `src/router.ts`, `vite.config.ts` (`ssgOptions` guard), `index.html` (env URLs), `.env.example`, `.gitignore`/eslint ignores (`.vite-ssg-temp`), `tailwind.config.js` (`future`), `Footer.vue` (`data-allow-mismatch`). Nothing deferrable without breaking a binding decision.
3. **Complexity check:** about 30 files but they are config mirrors the user explicitly chose (PR3, decision #17); new runtime "classes/services": 0 (one directive, one setup fn). Gate does not trigger a scope reduction; vite-ssg spends the one innovation token, and it is the boring, Antfu-maintained choice for Vue SSG [Layer 1].
4. **Search check:** WebSearch not used; verified against installed/packed package sources instead (stronger than search for version-specific behavior). Built-ins preferred: Vite `%ENV%`, native anchor scroll, Vue `data-allow-mismatch`, Tailwind `future` flag. No custom solution where a built-in exists, except the barrel generator (private package, accepted).
5. **TODOS:** no TODOS.md exists. Carried items (E6-E9, GBP, client self-edit) stay with Phase 1. New: beasties/font preload is QA-gated (TD-D3), og-image jpg fallback is QA-gated.
6. **Completeness:** plan does the complete version for this scope. **Distribution:** static `dist/` only; host/domain still TBD by owner (PR5); `VITE_SITE_URL` + the new build guard make the deploy step explicit. Listed in NOT in scope.

Scope accepted as-is (no reduction).

### Resolved bootstrap (exact)

`src/main.ts`:

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

- `export const createApp` is mandatory (vite-ssg imports that name). It shadows the auto-imported `vue` `createApp` at module scope: unplugin-auto-import skips locally declared names, TS allows the shadow in a module, `@typescript-eslint/no-redeclare` does not flag module scope. No hand-written `vue` import is needed.
- `hydration: import.meta.env.PROD`: prod hydrates the prerendered DOM (no hero animation replay, no DOM swap). Dev serves an empty `#app`, where hydrating would only produce Vue's "container is empty" warning.
- `useHead: false`: `index.html` is the single head source (P4/P5); no `useHead` calls anywhere.
- No `scrollBehavior` (pending UC-E1, recommended). If UC-E1 is rejected: add `scrollBehavior(to, _from, savedPosition) { if (savedPosition) { return savedPosition; } if (to.hash) { return { el: to.hash }; } return { top: 0 }; }` to the router options object and keep the QA Back-button case.
- `src/router.ts`: deleted. `src/App.vue`, `src/pages/index.vue` unchanged.

`package.json` scripts (only changes shown; everything else stays per spec):

```json
"build": "run-s build-only type-check",
"build-only": "vite-ssg build",
"prepare": "husky && vite build",
"type-check": "vue-tsc --noEmit -p tsconfig.app.json --composite false"
```

devDependency: `"vite-ssg": "^28.3.0"`. Do NOT add `@unhead/vue` (transitive dep of vite-ssg, unused) or `beasties`/`prettier` peers (optional). Bump `vue` floor to `^3.5.17` (unplugin-vue-router 0.19 peer on `@vue/compiler-sfc`).

`vite.config.ts` addition:

```ts
import type { ViteSSGOptions } from "vite-ssg";

const ssgOptions: ViteSSGOptions = {
  onBeforePageRender(_route, indexHTML) {
    if (indexHTML.includes("%VITE_SITE_URL%")) {
      throw new Error("VITE_SITE_URL is not set. Copy .env.example to .env.local or set it on the host.");
    }
  },
};
```

then `ssgOptions` inside `defineConfig({ ... })`. The `ViteSSGOptions` annotation is load-bearing (types the callback and pulls in vite-ssg's `UserConfig.ssgOptions` augmentation). Runs only under `vite-ssg build`, so `prepare` (`vite build`) on a fresh clone never trips it.

Fresh-clone flow:

```
  git clone -> npm install
     -> deps installed
     -> prepare: husky (sets core.hooksPath; no .git => message, exit 0)
              && vite build (client only, no SSG guard)
                   buildStart: index-generator -> src/types/index.ts (+composables/utils if files)
                   VueRouter   -> typed-router.d.ts
                   AutoImport  -> auto-imports.d.ts + auto-import.json
                   Components  -> components.d.ts
     -> npm run lint       OK (eslint.config.js reads auto-import.json)
     -> npm run type-check OK (barrels + d.ts present)
     -> git commit -> .husky/pre-commit: type-check && lint-staged (eslint --fix, prettier) OK
  deploy host: npm ci (prepare runs again, ~2s) -> npm run build (vite-ssg build: client + SSR + render "/" ) -> dist/
     guard: VITE_SITE_URL unset => build FAILS loudly (no silent bad og:image)
```

### Section 1: Architecture

```
  index.html (static head: meta, og:* with %VITE_SITE_URL%, JSON-LD, preload montero, favicon, color-scheme)
      |  Vite html env replacement at client build
      v
  src/main.ts  --imports--> @fontsource-variable/archivo/wdth.css, style.scss (tokens), vue-router/auto-routes (routes, handleHotUpdate)
      |  export const createApp = ViteSSG(App, { routes }, setup, { hydration: PROD, useHead: false })
      |
      +-- build time (vite-ssg build) ---------------------------------------------+
      |   client build -> dist/assets/*.js|css, dist/index.html                    |
      |   SSR build    -> .vite-ssg-temp/main.mjs  (createApp(route))              |
      |   renderToString(App) -> inject into #app -> ssgOptions.onBeforePageRender  |
      |   (guard: no literal %VITE_SITE_URL%) -> dist/index.html (prerendered)      |
      +----------------------------------------------------------------------------+
      |
      +-- browser: static HTML paints (hero CSS animation, all copy, images) -> JS loads
             -> createSSRApp + router.isReady -> app.mount("#app", hydrate=true)
             -> directive mounted hooks (vReveal: in-view? keep : hide + observe)
  App.vue -> RouterView -> pages/index.vue
      -> LayoutNav, HomeHero, HomePartners, HomeServices(+Cell x3), HomeRepaint, HomeTeam(+Hiring), HomeVisit(iframe), LayoutFooter
      -> consume BaseContainer/BaseButton/BaseEyebrow, "@/types" (barrel), vReveal, @phosphor-icons/vue, @/assets/images/*.webp
  tooling: index-generator(buildStart) -> src/types/index.ts ; unplugin-* -> *.d.ts, auto-import.json -> eslint.config.js ; husky -> pre-commit
```

Issues (auto-decided):

1. [P1] (confidence: 10/10) `scaffold.spec.md:94-95` "`const app = createApp(App).use(router); router.isReady().then(() => app.mount("#app"));`" and "`createRouter({ history: createWebHistory(...) })`": incompatible with the binding vite-ssg decision; `vite-ssg build` needs `export const createApp`. -> E-A1 (exact bootstrap above). Mechanical, P5.
2. [P1] (confidence: 10/10) vite-ssg client default `hydration: false` re-renders over the static DOM: the hero `motion-safe:animate-rise` elements are recreated and the entrance animation plays a second time after JS loads, and every image/iframe node is replaced. -> `hydration: import.meta.env.PROD` (E-A1). Mechanical, P1.
3. [P1] (confidence: 10/10) `og:image` absolute URL depends on an env var that, when unset, Vite leaves as the literal `%VITE_SITE_URL%` with only a warning: the Phase 1 CRITICAL GAP (silent broken preview) would survive in a new form. -> `ssgOptions.onBeforePageRender` guard + `.env.example` (E-A2). Mechanical, P1.
4. [P2] (confidence: 9/10) Head ownership: vite-ssg installs `@unhead/vue` by default and calls `renderDOMHead` on the output; with no `useHead` calls it is dead weight and a second head mechanism. -> `useHead: false`; static `index.html` owns the head (E-A3). Mechanical, P4.
5. [P2] (confidence: 9/10) E3/D-A7 `scrollBehavior` is now redundant (prerendered anchors scroll natively on cold load) and harmful: it flips `history.scrollRestoration` to `manual` and re-scrolls on every native `#hash` click via popstate, so Back after a nav jump can land at top instead of the prior position. -> UC-E1 (drop it). User Challenge because E3 was listed among approved items.
6. [P2] (confidence: 9/10) `.vite-ssg-temp/` is created in the project root and left behind when a build fails; `eslint .` would then lint the SSR bundle `.mjs` and fail with hundreds of errors. -> ignore in `.gitignore` and `eslint.config.js` (E-A4). Mechanical, P1.
   Distribution: static `dist/`; deploy pipeline deferred with PR5 (host TBD); build guard makes the required env explicit.
   Security: unchanged from Phase 1 (no inputs; `.npmrc` never copied; `.env.local` gitignored via `*.local`; `.env.example` holds no secret).

### Section 2: Code Quality

1. [P2] (confidence: 10/10) DRY/dead code: `src/router.ts` would duplicate router creation that `ViteSSG` already does. -> delete; `handleHotUpdate` moves to setup fn (E-A1).
2. [P2] (confidence: 10/10) `sections-bottom.spec.md:402` "`const year = new Date().getFullYear();`" + Phase 2 D-A11 "accepted, no code" assumed a silent patch; Vue 3.5 prod actually logs `console.error("Hydration completed but contains mismatches.")` once the build year differs from the visitor's year, breaking the "zero console errors" QA bar every January until redeploy. -> `data-allow-mismatch="text"` on the footer `<span>` (E-A5). Supersedes D-A11. Mechanical, P1.
3. [P2] (confidence: 10/10) `scaffold.spec.md:93` either/or `og:image` wording ("if Vite leaves og:image unrewritten, copy ...") is superseded by the gate: always `public/og-image.webp`, absolute via `%VITE_SITE_URL%`. Spec text must not survive into the build (E-A6).
4. [P3] (confidence: 8/10) `TD-D1` must be written as `future: { hoverOnlyWhenSupported: true }` (verified a `future` flag in 3.4.17), not under `experimental` (E-A7).
5. [P3] (confidence: 9/10) Hero `<link rel="preload" as="image">` is redundant once the `<img fetchpriority="high">` is in prerendered HTML; kept (zero cost, head parity with reference). No action.
6. [P3] (confidence: 7/10) `export const createApp` shadows an auto-import global; verified not flagged by `@typescript-eslint/no-redeclare` (module scope). QA lint confirms; if it ever is flagged, the fix is `["error", { builtinGlobals: false }]`, not a rename (name is fixed by vite-ssg).
   Over/under-engineering: no new abstraction added; the guard is 5 lines replacing a silent failure. Barrel plugin, typed router for one route: accepted per PR3.
   Stale ASCII diagrams: none in touched files (no code yet). The Phase 1 architecture diagram (`main.ts --> router.ts (scrollBehavior[E3])`, `index.html (noscript[E1])`) is stale after gate + this phase; the Section 1 diagram above replaces it.

### Section 3: Test (verification) review

No test framework by project rule (PR6). Every path maps to build / lint / typecheck / browse QA. QA MUST use `npm run build && npm run preview`; `npm run dev` does not prerender and cannot verify SSG paths.

```
CODE PATHS                                              VERIFIED BY
[+] package.json scripts
  ├── prepare (husky && vite build) fresh clone         [CHECK] rm generated files + node_modules, command npm install, lint + type-check pass
  ├── build-only (vite-ssg build)                       [BUILD] exit 0, "[vite-ssg] Build finished."
  └── guard: VITE_SITE_URL unset                        [BUILD] build fails with the message (negative check)
[+] src/main.ts ViteSSG
  ├── SSR render of "/"                                 [CHECK] dist/index.html contains H1, section ids, footer text
  ├── client hydration (PROD)                           [QA] hero animates once; 0 console errors/warnings
  └── HMR handleHotUpdate (dev)                         [QA-dev] edit a page, no full reload error
[+] index.html head
  ├── %VITE_SITE_URL% in og:image/og:url/JSON-LD        [CHECK] absolute URLs, no literal % token
  ├── preload href == img src (hashed)                  [QA] single montero request
  └── noscript removed, no Google Fonts/unpkg           [CHECK] grep dist/index.html
[+] src/directives/reveal.ts
  ├── SSR: hooks not run, no IO at import               [BUILD] SSR pass succeeds (would throw on import otherwise)
  ├── in-view at mount -> untouched                     [QA] cold /#visit, refresh mid-page: no blink
  ├── below fold -> hide, observe, reveal once          [QA] scroll down
  └── reduced motion -> nothing hidden                  [QA] emulate reduce
[+] Footer year (SSR build year vs client year)         [QA] no hydration console.error (data-allow-mismatch)
[+] Services Cell photo vs plain variant                [TYPE] TService union; [QA] 3 cells render
[+] Visit fact link vs text, external attrs             [QA] tel:, FB + directions new tab, sr-only text
[+] Map iframe loaded / blocked layer                   [QA] block google.com
[+] Tailwind future.hoverOnlyWhenSupported              [QA] touch emulation, no sticky hover
[+] tooling: eslint reads auto-import.json              [LINT] 0/0; .vite-ssg-temp ignored
[+] tooling: pre-commit type-check + lint-staged        [CHECK] after git init, test -f .husky/_/pre-commit

USER FLOWS
[+] JS off / blocked                                    [QA][->E2E-manual] full page readable
[+] Cold deep link /#visit                              [QA] lands on Visit, no jump after hydration
[+] Nav click then Back                                 [QA] returns to prior position (UC-E1 regression guard)
[+] Logo to top                                         [QA] D-A4
[+] Call / Facebook / Directions                        [QA]
[+] Share link preview                                  [POST-DEPLOY] FB Sharing Debugger (webp acceptance)
[+] Keyboard pass, both schemes, 320-1440, reduced motion [QA]

COVERAGE: 27/27 paths mapped to a verification (build 4, check 7, lint 1, type 1, QA 13, post-deploy 1)
GAPS: 0 unmapped. Residual: share preview only verifiable after deploy (host TBD).
```

REGRESSION RULE: two regressions vs the static reference were found and get mandatory QA cases (no test files by rule): (a) hero animation replay without hydration (E-A1 fixes, QA case "animates once"); (b) Back-button position with scrollBehavior (UC-E1, QA case "Nav click then Back").
Test plan artifact written: `~/.gstack/projects/zcars/admin-nobranch-test-plan-20261003-211533.md`.

### Section 4: Performance

- **LCP.** Prerender moves first paint off the JS critical path (was the Phase 1 top perf issue). 1440: LCP is the Montero image (80 KB webp, `fetchpriority="high"`, preloaded, in static HTML). 390: hero image is below the fold, LCP is the H1 text, gated by the render-blocking Tailwind CSS (single file, small) and the font swap.
- **Font.** One 90 KB latin wdth woff2, `font-display: swap`; latin-ext/vietnamese files load only for matching glyphs. The swap from system-ui to Archivo 125% reflows the H1 (TD-D3, deferred, QA-gated on hero CLS > 0.1). Upgrade path if the gate trips: `npm i -D beasties` (vite-ssg auto-enables it; defaults `inlineFonts: true, preloadFonts: true` plus critical CSS inlining), not a hand-written preload with a hashed filename.
- **Images.** 7 webp, 15-144 KB, all with width/height (no CLS). `ojt.webp` 144 KB is lazy. No srcset: phones download desktop-size files (largest 144 KB); acceptable for a brochure, listed NOT in scope.
- **JS.** Estimated about 45-55 KB gz: vue runtime with hydration, vue-router, vite-ssg client, `@unhead/vue` client (still bundled because `useHead` is a runtime option, about 4 KB gz, accepted ceiling), app code, about 7 Phosphor icons (`sideEffects: false`, tree-shaken; each icon carries all 6 weights, about 0.7 KB gz each). Measure in QA from `dist/assets`.
- **Build.** SSR pass externalizes `@phosphor-icons/vue` (Node loads the 1.5k-module index once; seconds, build-time only). `prepare` makes deploy hosts build twice (client `vite build` then `vite-ssg build`), adds a few seconds, accepted (gate).
- No DB, no N+1, no runtime memory concerns; one shared IntersectionObserver.

### CLAUDE SUBAGENT (eng — independent review)

Fresh pass by a separate subagent that had not seen this review. It could not read vite-ssg source (not installed in the reference repo), so it worked from the documented API. Summary, with how each point was handled:

- [HIGH] With `hydration: false` the client remounts over the prerendered DOM, so the hero animation replays and reveal targets flicker. Agrees with Section 1 #2. Fix: E-A1 (`hydration: import.meta.env.PROD`).
- [HIGH] `src/router.ts` and `isReady().then(mount)` are dead or conflicting under vite-ssg. Agrees with Section 1 #1. Its proposed fix differs: use `vite-ssg/single-page` and drop the whole router stack (unplugin-vue-router, typed-router.d.ts, scrollBehavior). REJECTED: it contradicts the explicit full-mirror decision (PR3, audit #17). The kept fix is E-A1, which keeps the router and deletes only `router.ts`.
- [MED] `export const createApp` shadows the auto-import global, and `no-redeclare`/`no-shadow` might fire. Checked against the rule source: `@typescript-eslint/no-redeclare` checks builtin globals in global scope only, and the reference config has no `no-shadow`. Kept as a QA lint check (Section 2 #6), with the fallback recorded.
- [MED] `build-only` still says `vite build`. Agrees: E-A8.
- [HIGH] The design-tokens spec text still says "one module-level IntersectionObserver", so the observer would be created at import and throw during SSR. Agrees, and it is a stale spec line (T4 decided lazy creation but the spec text was never amended). Added to the design-tokens index below.
- [LOW] Footer year: "accept". DISAGREES. In production Vue 3.5 logs `console.error` on a hydration mismatch (verified in runtime-core source), so this breaks the zero-console-errors bar. Kept E-A5 (`data-allow-mismatch`).
- [HIGH] An unset `VITE_SITE_URL` stays as a literal. Agrees: E-A2 guard. Its alternative, committing `.env.production`, was rejected because the domain is TBD and the owner must not guess it.
- [MED] `prepare` builds on every install. Its fix (commit the generated files and keep `prepare: husky`) conflicts with the binding gate TD1. Not reopened; the cost is noted in Section 4.
- Missing verification: dist markup grep, JS-off load, throttled double-animation check, fresh-clone simulation. All four are already in the Section 3 diagram and the test plan artifact.
- Cuts proposed: router stack, barrel generator, sass, devtools, and the duplicate type-check. All rejected per PR3 (the user chose the full mirror). Logged only.

### Eng consensus table

```
  ENG DUAL VOICES - CONSENSUS TABLE  [single-model: Codex unavailable]
  ===============================================================================
  Dimension                                  Claude-primary  Claude-subagent  Codex  Consensus
  -----------------------------------------  --------------  ---------------  -----  ---------
  1. Architecture sound (ViteSSG bootstrap)?  FIX (E-A1)      FIX              N/A    CONFIRMED (fix differs: keep router per PR3)
  2. Hydration needed (no replay)?            YES (PROD)      YES              N/A    CONFIRMED
  3. SITE_URL failure handled?                GUARD           GUARD/.env.prod  N/A    CONFIRMED (guard)
  4. SSR-safe browser APIs?                   YES after T4    spec text stale  N/A    CONFIRMED (amend spec text)
  5. Fresh-clone flow works?                  YES (gate)      YES, but costly  N/A    CONFIRMED (cost accepted)
  6. Footer year acceptable as-is?            NO (E-A5)       YES              N/A    DISAGREE -> E-A5 (source-verified)
  7. Verification covers risks?               YES             YES (4 adds)     N/A    CONFIRMED (all 4 present)
  8. Scope right-sized?                       YES (PR3)       cut router etc.  N/A    DISAGREE -> PR3 binding, logged
  ===============================================================================
```

### Amendments (auto-decided; builders apply, specs unchanged)

- **E-A1 (scaffold `src/main.ts`, `src/router.ts`, owned-files list)** Replace the bootstrap with the exact `ViteSSG` `main.ts` above; delete `src/router.ts` from the owned list and do not create it; `handleHotUpdate` lives in the setup fn; client options `{ hydration: import.meta.env.PROD, useHead: false }`. Supersedes D-A13 and the `createApp`/`isReady().then` text at `scaffold.spec.md:94-95`.
- **E-A2 (scaffold `vite.config.ts`, `.env.example`, `index.html`)** Add the `ssgOptions` guard above. Commit `.env.example` with `VITE_SITE_URL=http://localhost:4173` (no trailing slash); builders copy it to `.env.local` (gitignored by `*.local`) before `npm run build`; the host sets the real value. In `index.html`: `og:image` `%VITE_SITE_URL%/og-image.webp`, `og:url` `%VITE_SITE_URL%/`, plus `og:type`, `og:image:alt`, `twitter:card` (E2); JSON-LD add `"url":"%VITE_SITE_URL%/"` and `"image":"%VITE_SITE_URL%/og-image.webp"`.
- **E-A3 (scaffold)** Static `index.html` is the only head source; no `useHead`, no `@unhead/vue` dependency entry.
- **E-A4 (scaffold `.gitignore`, `eslint.config.js`)** Add `.vite-ssg-temp` to `.gitignore` and `"**/.vite-ssg-temp/**"` to eslint `ignores`.
- **E-A5 (sections-bottom `Footer.vue`)** Footer copyright `<span data-allow-mismatch="text">`. Supersedes D-A11.
- **E-A6 (scaffold `index.html`)** Delete the conditional og:image instruction; always `public/og-image.webp` (copy of `montero.webp`); keep `<link rel="preload" as="image" href="/src/assets/images/montero.webp">` (Vite rewrites it to the hashed asset). No `<noscript>` (UC-D1 accepted).
- **E-A7 (design-tokens `tailwind.config.js`)** `future: { hoverOnlyWhenSupported: true }` (TD-D1; flag verified in 3.4.17).
- **E-A8 (scaffold `package.json`)** Scripts as above; add `vite-ssg ^28.3.0`; `vue ^3.5.17`; keep `vue-router ^4.6.4`.
- **E-A9 (QA, all specs' Verify)** Verify becomes `cp -n .env.example .env.local; npm run build && npm run lint`; browser checks run on `npm run preview`, not dev. Test plan artifact is the QA input.
- **E-A10 (design-tokens `reveal.ts`)** Confirm D-A1 + T4 under hydration: `mounted` runs after hydration on the client only; directive must not define `getSSRProps`; no `window`/`document` at module scope (the `let observer: IntersectionObserver | undefined` type annotation is fine).

### Taste decisions (eng)

- **TD-E1 hydration only in prod** (`import.meta.env.PROD` vs always `true`). Recommend PROD (P5): dev never has server markup, so `true` only adds a dev warning. Low stakes.
- **TD-E2 SITE_URL guard location** (`ssgOptions.onBeforePageRender` vs a `postbuild` grep script). Recommend the typed `ssgOptions` hook (P5 explicit, typed, cross-platform).

### User challenges (not auto-decided)

- **UC-E1 drop router `scrollBehavior` (E3 / D-A7 / T3 / T13 part).** Prerender made it redundant: the browser scrolls to `#visit` natively from static HTML. Keeping it sets `history.scrollRestoration = "manual"` and re-runs on every native hash click, so Back after a nav jump can land at the top (regression vs the static reference). Recommendation: drop it; D-A4 `scroll-mt-nav` on `main#top` then works natively. If kept: use the D-A7 shape and keep the Back-button QA case. Challenges an item Phase 2 listed as approved, so the user decides.

### NOT in scope (eng)

- `beasties` critical CSS / font preload: QA-gated (TD-D3).
- Responsive `srcset` images: largest file 144 KB; revisit if mobile LCP fails.
- og-image 1200x630 jpg: only if the FB Sharing Debugger rejects webp post-deploy.
- Deploy pipeline / host config / CSP headers: host TBD (PR5).
- 404 page: single route; host default 404.
- Unit/E2E test files: project rule (PR6).
- `ssr.noExternal` for icons: build-time only cost.

### What already exists

vite-ssg (router creation, SSR render, hydration, head), Vite `%ENV%` html replacement, native anchor scrolling, Vue `data-allow-mismatch`, Tailwind `future.hoverOnlyWhenSupported`, husky's no-`.git` tolerance, reference `vite.config.ts` barrel generation and `eslint.config.js`. The plan rebuilds none of these.

### Failure Modes Registry (eng)

```
  CODEPATH              | FAILURE MODE                          | RESCUED?        | VERIFIED?          | USER SEES?            | CRITICAL?
  ----------------------|---------------------------------------|-----------------|--------------------|-----------------------|----------
  vite-ssg build        | VITE_SITE_URL unset                   | Y guard throws  | BUILD negative chk | n/a (build fails)     | closed (was CRITICAL)
  vite-ssg build        | SSR imports browser API               | Y build fails   | BUILD              | n/a                   | no
  vite-ssg build        | failed build leaves .vite-ssg-temp    | Y ignored (E-A4)| LINT               | n/a                   | no
  client hydrate        | default re-render replays hero anim   | Y hydration PROD| QA                 | double entrance       | no (fixed)
  client hydrate        | year mismatch console.error           | Y allow-mismatch| QA console         | none                  | no (fixed)
  client hydrate        | other mismatch (non-deterministic SSR)| N               | QA console         | console.error only    | no (loud)
  router scroll         | Back lands at top (if UC-E1 rejected) | N               | QA case            | wrong position        | no (QA covers)
  prepare (fresh clone) | no .git                               | Y husky exit 0  | CHECK              | dev only              | no
  prepare on host       | devDeps omitted (--omit=dev)          | N fails loudly  | n/a                | deploy fails          | no (loud)
  og:image              | crawler rejects webp                  | N               | POST-DEPLOY debugger| no preview image     | no (verified post-deploy)
  font swap             | H1 reflow / CLS                       | partial (swap)  | QA CLS gate        | brief reflow          | no
  reveal                | IO missing / JS off                   | Y visible       | QA JS-off          | content visible       | no
```

Critical gaps: 0 open (the Phase 1 og:image CRITICAL GAP is closed by E-A2's loud guard).

### Worktree parallelization

Unchanged from the specs' wave plan: Lane A scaffold (wave 0) -> Lanes B design-tokens + C content-and-base (wave 1, parallel, disjoint files) -> Lanes D sections-top + E sections-bottom (wave 2, parallel, disjoint files). Eng amendments add no cross-lane file: E-A1/2/3/4/6/8 scaffold, E-A7/E-A10 design-tokens, E-A5 sections-bottom. No conflict flags.

### Implementation Tasks (Phase 3)

- [ ] **T17 (P1, human: ~30min / CC: ~5min)** scaffold: ViteSSG `main.ts`, delete `router.ts`, scripts + `vite-ssg` dep (E-A1, E-A8). Verify: `npm run build` shows `[vite-ssg] Build finished.`; `dist/index.html` contains the H1.
- [ ] **T18 (P1, human: ~20min / CC: ~3min)** scaffold: `%VITE_SITE_URL%` head + JSON-LD, `.env.example`, `ssgOptions` guard (E-A2, E-A6). Verify: build fails without `.env.local`, passes with it; no literal token in dist.
- [ ] **T19 (P2, human: ~5min / CC: ~1min)** scaffold: `.vite-ssg-temp` ignores (E-A4). Verify: lint passes with a stale temp dir present.
- [ ] **T20 (P2, human: ~5min / CC: ~1min)** sections-bottom: `data-allow-mismatch="text"` on footer span (E-A5). Verify: preview console clean.
- [ ] **T21 (P2, human: ~5min / CC: ~1min)** design-tokens: `future.hoverOnlyWhenSupported` (E-A7). Verify: built CSS has `@media (hover:hover) and (pointer:fine)`.
- [ ] **T22 (P1, pending UC-E1)** scaffold: omit `scrollBehavior` (recommended) or keep D-A7 shape + Back QA case.
- [ ] **T23 (P2)** QA: run the test plan artifact against `npm run preview` (E-A9).

### Completion Summary (Phase 3)

```
  +====================================================================+
  |            ENG PLAN REVIEW - COMPLETION SUMMARY                    |
  +====================================================================+
  | Step 0               | scope accepted as-is; bootstrap resolved     |
  | Architecture         | 6 issues (3 P1, 3 P2)                         |
  | Code Quality         | 6 issues (2 P2 fixed, 4 P3/notes)             |
  | Tests (verification) | diagram produced, 27 paths, 0 unmapped gaps   |
  | Performance          | 0 blocking; 2 QA-gated (font CLS, JS size)    |
  | NOT in scope         | written (7 items)                             |
  | What already exists  | written                                       |
  | TODOS.md updates     | 0 new (no TODOS.md; items QA-gated)           |
  | Failure modes        | 12 mapped, 0 critical gaps (1 closed)         |
  | Outside voice        | Claude subagent ran; Codex unavailable        |
  | Parallelization      | 5 lanes, 2 parallel pairs, unchanged waves    |
  | Lake Score           | 9/10 recommendations chose complete option    |
  | Amendments           | E-A1..E-A10; 2 taste; 1 user challenge        |
  +====================================================================+
```

### Amendments by spec file (builder index)

- **Amendment for scaffold.spec.md:** delete `src/router.ts` from Owned files; `src/main.ts` = the exact ViteSSG block in "Resolved bootstrap" (`hydration: import.meta.env.PROD`, `useHead: false`, `handleHotUpdate` in the setup fn), replacing lines 94-95. Scripts `build-only: vite-ssg build`, `prepare: husky && vite build`; add devDep `vite-ssg ^28.3.0`; `vue ^3.5.17`. Add the `vite.config.ts` `ssgOptions` guard (typed `ViteSSGOptions`). Add `.env.example` (`VITE_SITE_URL=http://localhost:4173`) and copy it to `.env.local` in Order of work, before step 4. `index.html`: absolute `%VITE_SITE_URL%` og:image/og:url plus og:type, og:image:alt and twitter:card; JSON-LD `url` + `image`; always `public/og-image.webp` (remove the either/or wording at line 93); no `<noscript>`. Add `.vite-ssg-temp` to `.gitignore` and `**/.vite-ssg-temp/**` to the eslint ignores. Acceptance: `dist/index.html` contains prerendered section markup and no literal `%VITE_SITE_URL%`; the build fails when the env var is unset. Remove any `scrollBehavior` text pending UC-E1.
- **Amendment for design-tokens.spec.md:** in `reveal.ts`, change the "one module-level IntersectionObserver" text at line 201 to "created lazily on first `mounted`" (T4), with all logic in `mounted` (D-A1). No `getSSRProps`, and no `window`/`document` at module scope. `tailwind.config.js` gets `future: { hoverOnlyWhenSupported: true }` (E-A7, TD-D1). Verify step adds the `cp -n .env.example .env.local` precondition.
- **Amendment for content-and-base.spec.md:** no eng change beyond the prior phases' T5 (TService union), D-A6 and D-A9. Verify precondition: `.env.local` (E-A9).
- **Amendment for sections-top.spec.md:** no eng code change. Browse checks run on `npm run build && npm run preview` (prerendered), not `npm run dev`. QA case: the hero animates once (no replay on hydration).
- **Amendment for sections-bottom.spec.md:** `LayoutFooter` copyright `<span data-allow-mismatch="text">` (E-A5, supersedes D-A11). Browse checks run on `npm run preview`.
- **Amendment for zcars-vue.spec.md:** add `vite-ssg` (prerender) to Tooling. Change the `build` line to `vite-ssg build` + type-check. Acceptance adds: prerendered HTML, absolute OG URLs from `VITE_SITE_URL`, and zero console errors on `npm run preview`.

## Phase 3.5: DX Review

Method: gstack /plan-devex-review at full depth (Step 0A-0G, Passes 1-8, required outputs), mode **DX POLISH**, auto-decided (P1-P6). Product type: **developer-maintained static site (project template / docs surface)**; the developer-facing surface is the repo itself: README, npm scripts, env setup, content files, error messages, hooks. Competitive web search skipped; reference benchmarks used. Voices: Claude primary + Claude subagent (independent). Codex: unavailable. Source read-only; specs NOT edited; every fix is an "Amendment for <spec>".

Baseline: binding gate + Phase 3 decisions (full mirror PR3; vite-ssg `export const createApp = ViteSSG(...)`, `src/router.ts` deleted, hydration in PROD, `useHead: false`; `build-only: vite-ssg build`, `prepare: husky && vite build`; `VITE_SITE_URL` via `.env.example` / `.env.local` + `ssgOptions` guard; scrollBehavior dropped (UC-E1 accepted); noscript dropped; no test files).

### Verified facts (read, not remembered)

| Fact                                                                                                                                                                                                                                        | Source                                                                             | Confidence |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------- |
| Reference repo `README.md` is the unedited `create-vue` boilerplate (titled `admin-dashboard-next-ts`, mentions `test:unit` that this plan does not have); reference `package.json` has no `engines`                                        | `patient-dashboard-next/README.md`, `package.json`                                 | 10         |
| Reference `.nvmrc` is `v18`; plan sets `v24`; local Node is v24.16.0                                                                                                                                                                        | files + `node -v`                                                                  | 10         |
| `vite-ssg` 28.3.0 `engines.node >=20.0.0`; `ssgOptions` has both `onBeforePageRender(route, indexHTML)` and `onPageRendered(route, renderedHTML)`                                                                                           | packed tarball `package.json`, `dist/shared/*.d.mts:79,88`                         | 10         |
| Business facts are duplicated outside `src/types/contact.ts`: phone in `<meta name="description">` ("Call 0963 745 7661") and JSON-LD `telephone`; Facebook URL in JSON-LD `sameAs`; business name in `<title>`, `og:title`, JSON-LD `name` | `docs/reference/index.html:6-7,18` (copied verbatim into `index.html` by scaffold) | 10         |
| Reference `eslint.config.js:17` does a synchronous `readFileSync("./auto-import.json")` (gitignored, generated)                                                                                                                             | reference file                                                                     | 10         |
| Barrel generator runs in `buildStart` only and `src/{types,composables,utils}/index.ts` are watch-ignored: a NEW file added while `npm run dev` runs is not barreled until restart                                                          | `scaffold.spec.md` vite.config section                                             | 9          |
| zcars has no README, no `package.json` yet; only `docs/` and `.gstack/`                                                                                                                                                                     | `ls`                                                                               | 10         |

### Step 0A: Developer persona (auto-decided, P6)

```
TARGET DEVELOPER PERSONA
========================
Who:       Primary: the owner-developer. Vue 3 + TS dev who lives in patient-dashboard-next daily.
           Secondary: a future contributor (freelancer, junior, or the owner in 9 months) whose only
           job is "change the phone number / add a service / take down the hiring row".
Context:   Rare, bursty edits. Weeks or months between sessions. Usually a 10-minute content change
           under client pressure ("our number changed").
Tolerance: Owner: ~5 min to running site, knows the toolchain. Contributor: ~10 min, then edits the
           built HTML on the host by hand.
Expects:   README with 3-command start, a "where is the copy" map, `npm run dev` just works,
           errors that say what to do, a known deploy command.
```

### Step 0B: Developer empathy narrative (contributor, first person)

I get a message: "Zcars changed their number, can you update the site?" I clone the repo. There is no README, so I open `package.json` and see `dev`, `build`, `build-only`, `preview`, `prepare`, `clear:auto-generated`. I run `npm install` on whatever Node I have; it also runs a full `vite build` through `prepare`, which surprises me but finishes. `npm run dev` works and the console warns about `%VITE_SITE_URL%` in `index.html`, which I do not understand. Now I need the phone number. I search for "0963" and get four hits: `src/types/contact.ts`, `index.html` meta description, and the JSON-LD `telephone` (as `+639637457661`, so my search for "0963" missed it). I fix `contact.ts`, the page updates, and I almost ship. Google would keep showing the old number from JSON-LD. Then `npm run build` fails with "VITE_SITE_URL is not set. Copy .env.example to .env.local or set it on the host." Clear enough, but I do not know what value the host should get or whether a trailing slash matters. I commit; the pre-commit hook runs a full `vue-tsc` for 10+ seconds and I wonder if it hung. I have no idea how this gets deployed. Total: about 25 minutes for a one-line change, and one silent stale fact.

### Step 0C: Competitive benchmark (reference, no search)

```
COMPETITIVE DX BENCHMARK
=========================
Tool                          | TTHW    | Notable DX choice                               | Source
Vercel template clone          | ~2 min  | README quick start + one-click deploy           | reference benchmark
create-vue / create-vite       | ~1 min  | `npm create`, `npm run dev`, done               | reference benchmark
Astro starter (content site)   | ~2 min  | content in `src/content`, README "edit here"    | reference benchmark
zcars, plan as written         | ~4 min owner / ~12 min contributor | full toolchain, no README   | this plan
zcars, after amendments        | <3 min both | README 4-command start + content map        | target
```

Target tier (auto-decided, P3): **Competitive (<3 min) clone -> site visible locally**. Champion (<2 min) is bounded by `npm install` of ~30 devDeps plus the `prepare` build; not worth fighting for a brochure.

### Step 0D: Magical moment

For this product the magic is: "I changed one constant and every place that shows the phone number (nav CTA, hero CTA, Visit fact, JSON-LD, meta description) changed, and the build told me if anything disagreed." Delivery vehicle: **copy-paste quick start + a README content map + a build-time consistency check** (option B, copy-paste command, adapted). Interactive playground / video: rejected (P3, a one-page brochure).

### Step 0E: Mode

DX POLISH (given). Scope is right; make every touchpoint bulletproof. No new features.

### Step 0F: Developer journey map (9 stages, resolved)

```
STAGE              | DEVELOPER DOES                                   | FRICTION POINT (evidence)                                      | RESOLUTION                     | STATUS
-------------------|--------------------------------------------------|----------------------------------------------------------------|--------------------------------|--------
1. Discover        | Opens repo root                                  | No README; nothing says what this is or that docs/reference is the visual contract | DX-A1 README                   | fixed
2. Install         | nvm use, npm install                             | Node floor unstated outside .nvmrc; old Node fails deep in vite-ssg/jsdom | DX-A3 engines >=20 + README prereq | fixed
3. Hello world     | npm run dev                                      | Vite warns on literal %VITE_SITE_URL% in dev when .env.local missing | DX-A1 quick start step `cp .env.example .env.local` | fixed
4. Edit content    | Change phone / service / hiring copy             | Content lives in `src/types/*.ts` (non-obvious name); phone, FB URL, name duplicated in index.html head | DX-A1 content map + DX-A4 consistency check | fixed
5. Verify prod     | npm run build && npm run preview                 | Dev does not prerender; nothing tells the dev to check preview | DX-A1 scripts table            | fixed
6. Commit          | git commit                                       | pre-commit runs full vue-tsc (mirror); silent for ~10s          | DX-A1 one line in README       | ok (mirror, documented)
7. Deploy          | Configure static host                            | Host TBD (PR5); build cmd, output dir, env, devDeps-at-install all unstated | DX-A1 Deploy section (host-agnostic) | fixed
8. Debug           | Build fails / lint crashes / import not found    | guard message lacks cause and value format; new src/types file not barreled until dev restart; stale generated files | DX-A2 message, DX-A1 Troubleshooting | fixed
9. Upgrade         | npm outdated, bump deps months later             | No upgrade routine; prettier pinned exact; peers tangle (unplugin-vue-router on compiler-sfc) | DX-A1 Upgrading section        | partial (deferred: Renovate)
```

### Step 0G: First-time developer confusion report (contributor)

```
FIRST-TIME DEVELOPER REPORT
============================
Persona: future contributor, changing the phone number
Attempting: zcars clone -> edit -> deploy

CONFUSION LOG:
T+0:00  Clone. No README. Opens package.json; six scripts, two named build.           -> DX-A1 [addressed]
T+0:40  npm install on Node 18 (reference .nvmrc habit). Fails inside vite-ssg/jsdom
        with an engine or syntax error, not "use Node 24".                            -> DX-A3 [addressed]
T+3:00  npm run dev. Warning about %VITE_SITE_URL%. Ignores it.                      -> DX-A1 step 3 [addressed]
T+4:00  Greps "0963". Edits contact.ts. Misses JSON-LD "+639637457661".               -> DX-A4 [addressed]
T+6:00  npm run build fails on VITE_SITE_URL. Message has the fix but not the cause
        or the value format.                                                          -> DX-A2 [addressed]
T+8:00  Adds src/types/hours.ts while dev runs; `import { HOURS } from "@/types"`
        fails; restarts by luck.                                                       -> DX-A1 Troubleshooting [addressed]
T+10:00 Commits; hook silent for ~10s.                                                 -> DX-A1 note [addressed]
T+12:00 No deploy instructions. Asks the owner.                                       -> DX-A1 Deploy [addressed]
```

Auto-decided: address all (P1).

### Pass 1: Getting Started (5/10 -> 8/10)

Evidence: 0B narrative and 0F stages 1-3. It is a 5 because the toolchain works (`prepare` regenerates everything on install, verified Phase 3) but nothing tells anyone the commands, the Node floor, or the env step. A 10: one copy-paste block in README, Node mismatch caught by npm, dev server clean on first run, under 3 minutes. Fix (DX-A1, DX-A3) gives the exact sequence:

```
nvm use                       # Node 24 from .nvmrc (>=20 required)       ~5s
npm install                   # also generates types, barrels, d.ts       ~60-120s
cp .env.example .env.local    # VITE_SITE_URL for local builds            ~1s
npm run dev                   # http://localhost:5173                    ~2s
```

Remaining gap to 10: install time (accepted).

### Pass 2: Scripts + content API (6/10 -> 8/10)

Evidence: scripts mirror the reference (persona 1 guesses them correctly), but `build` vs `build-only`, `clear:auto-generated` with no "regenerate" partner, and `lint` silently rewriting files (`--fix`) are opaque to persona 2. Content API: typed constants in `src/types/{contact,service,navigation,partner,image}.ts`; strong (types catch a missing `tags` or wrong icon), but the folder name says "types", not "content" (Standards placement, decision 8, kept). A 10: every script described in one table, content files named in a map, consistency enforced. Fix: DX-A1 scripts table + content map; DX-A4. No renames (PR3 mirror, P6).

### Pass 3: Error messages and debugging (5/10 -> 8/10)

Three error paths traced:

1. **VITE_SITE_URL unset** (Phase 3 guard). Today: `VITE_SITE_URL is not set. Copy .env.example to .env.local or set it on the host.` Has problem + fix, lacks cause and value format. Should be (DX-A2):
   `[zcars] VITE_SITE_URL is not set. index.html uses it for og:image, og:url and JSON-LD, and Vite leaves an unset variable as the literal "%VITE_SITE_URL%", so link previews would break. Fix: run "cp .env.example .env.local" for local builds, or set VITE_SITE_URL=https://<your-domain> (no trailing slash) in the host's build environment. Not needed for `npm run dev`. See README "Deploy".`
2. **Cold lint before generation** (reference `eslint.config.js:17` `readFileSync` of gitignored `auto-import.json`). Today: raw `ENOENT ... auto-import.json` stack. Prevented by `prepare` (Phase 3), but `npm install --ignore-scripts` or `npm run clear:auto-generated` then `lint` still hits it. Fix: README Troubleshooting maps `ENOENT auto-import.json` / `Cannot find module '@/types'` -> `npm run build-only` (or restart dev). Changing the mirrored eslint file: rejected (PR3).
3. **Head facts out of sync with `contact.ts`**. Today: silent (stale phone in Google). Fix (DX-A4): `ssgOptions.onPageRendered` check in the same `ssgOptions` object, fails the build with `[zcars] index.html head is out of sync with src/types/contact.ts: JSON-LD telephone "+63..." but the page links "tel:+63...". Update index.html (meta description + JSON-LD) to match contact.ts.` Same check for the Facebook URL in `sameAs`.
   Debug mode: `vite --debug` exists; no action. Stack traces: build failures are Vite/Rollup frames; acceptable.

### Pass 4: Documentation (2/10 -> 8/10)

Evidence: zero docs for the repo; reference README is boilerplate and mentions a script that does not exist here, so copying it would be actively wrong. A 10 for this product: one README under ~120 lines; quick start first; "Edit content" map second; no tutorial needed. Fix DX-A1 (README sections, in order): what it is (1 line + link to `docs/reference/index.html` as the visual contract); Prerequisites (Node 24 via `.nvmrc`, >=20 floor, npm); Quick start (4 commands above); Scripts table (`dev` = HMR, no prerender; `build` = SSG + type-check; `preview` = serve `dist/`, use this to check production; `lint` = autofixes; `clear:auto-generated` + `build-only` to regenerate); Edit content map (table below); Images (replace `src/assets/images/<name>.webp` and update `width`/`height` where listed; `public/og-image.webp` is a separate copy for link previews); Deploy (host-agnostic: build `npm run build`, output `dist`, env `VITE_SITE_URL`, Node from `.nvmrc`, devDependencies must be installed at build time, so no `--omit=dev` / `NODE_ENV=production` during install); Troubleshooting (3 rows from Pass 3 + dev-restart rule); Upgrading (Pass 5). Not a separate CONTRIBUTING.md (P3).

Content map (exact, from the specs):
| To change | Edit | Also edit |
|---|---|---|
| Phone | `src/types/contact.ts` `PHONE_DISPLAY`, `PHONE_HREF` | `index.html` meta description + JSON-LD `telephone` (build checks) |
| Facebook page | `src/types/contact.ts` `FACEBOOK_URL` | `index.html` JSON-LD `sameAs` (build checks) |
| Business name | `src/types/contact.ts` `BUSINESS_NAME` | `index.html` `<title>`, `og:title`, JSON-LD `name` |
| Map / directions | `src/types/contact.ts` `MAP_EMBED_URL`, `MAP_DIRECTIONS_URL` | none |
| Services (cards) | `src/types/service.ts` `SERVICES` | none (first entry is the tall cell) |
| Nav links | `src/types/navigation.ts` `NAV_LINKS` | section `id` in `src/components/Home/*` |
| Partner names | `src/types/partner.ts` `PARTNER_NAMES` | `src/assets/images/partners.webp` (logo strip image) |
| Hero / repaint / team / hiring copy | `src/components/Home/{Hero,Repaint,Team/index,Team/Hiring}.vue` | none |
| Footer tagline | `src/components/Layout/Footer.vue` | none |
| Share preview text/image | `index.html` `og:*`, `public/og-image.webp` | none |

### Pass 5: Upgrade path (4/10 -> 6/10)

Evidence: CEO 6-month regret ("first npm install after a long gap fails on a peer conflict"). Lockfile committed and `.nvmrc` pinned are in the plan. No routine. A 10: Renovate with grouped PRs and a CI build. For a solo brochure that is YAGNI. Fix DX-A1 "Upgrading": `npm outdated`; bump one group at a time (vite + plugins + vite-ssg; vue + vue-router + unplugin-vue-router; eslint group); after each: `npm run clear:auto-generated && npm run build && npm run lint && npm run preview`; never `--force` (scaffold rule). Deferred: Renovate/CI (NOT in scope).

### Pass 6: Dev environment and tooling (7/10 -> 8/10)

Evidence: full mirror gives Volar types, auto-import d.ts, typed router, ESLint + Prettier on commit, HMR (with `handleHotUpdate` kept in the ViteSSG setup fn). Gaps: Node floor only in `.nvmrc` (hosts and non-nvm users ignore it) -> DX-A3 `"engines": { "node": ">=20" }` (vite-ssg's verified floor); dev vs preview difference undocumented -> DX-A1; barrel not regenerated for a new file during dev -> README rule ("restart `npm run dev` after adding a file to `src/types`, `src/composables` or `src/utils`"), plugin change rejected (P3, mirror parity, TD-X2). Pre-commit full `vue-tsc` kept (mirror). Cross-platform: `clear:auto-generated` uses `rm -rf` (fails on Windows cmd); persona is macOS; accepted, noted.

### Pass 7: Community and ecosystem (3/10 -> 6/10)

Private client repo: no community, license, or plugin ecosystem needed. The relevant slice is "can a second person contribute safely": README content map + build checks are the contribution guide. Remaining gap: no owner contact / handoff note (who holds the host and domain). Fix: README "Ownership" one-liner left for the owner to fill (host, domain, who to ask), no guessed values. CEO's starter-template idea stays deferred.

### Pass 8: DX measurement (2/10 -> 5/10)

Evidence: nothing measures TTHW or friction. A 10 would be a timed fresh-clone check in CI. YAGNI for CI; but the Phase 3 fresh-clone CHECK already exists in QA. Fix (DX-A5): extend that QA CHECK to follow the README quick start verbatim from a clean copy and record wall time; pass bar < 3 min and zero console warnings in `npm run dev`. Boomerang: `/devex-review` can re-measure post-build against this 3-minute target.

### CLAUDE SUBAGENT (DX - independent review)

Fresh subagent, no access to this review; read the specs, Phase 3, and the reference repo. Scores: GS 6, API 5, Errors 6, Docs 2, Upgrade 4, DevEnv 6, Community 3, Measurement 1. TTHW: owner 2-3 min, contributor 10-20 min. Findings and handling:

- [HIGH] No README; needs prereqs, quickstart, preview-the-real-build, content map, deploy contract. Agrees: DX-A1.
- [HIGH] `.env.example` value `http://localhost:4173` passes the guard; if a host or CI copies it (the E-A9 habit), og:url/og:image/JSON-LD ship pointing at localhost, silently. NEW, valid. Handled by DX-A6 (warn on localhost in the rendered head; throw rejected because `npm run build && npm run preview` QA legitimately uses localhost) plus README Deploy "never copy .env.example on the host".
- [HIGH] `prepare` (`vite build`) leaves a client-only `dist/` after every install, not prerendered and carrying the literal `%VITE_SITE_URL%`; a drag-and-drop deploy of it skips the guard. NEW, valid. Fix changes the literal text of binding TD1, so it is UC-X1, not auto-applied.
- [MED] Copy split between `src/types` constants and inline SFC copy; document or consolidate. Agrees on documenting (content map lists inline copy); consolidation into `copy.ts` rejected (P3, specs already partition copy, decision 8).
- [MED] Guard text should add an example and "not needed for `npm run dev`". Merged into DX-A2.
- [MED] `engines` should back `.nvmrc`; it proposes `>=24`. Partly agrees: DX-A3 uses `>=20`, the verified vite-ssg floor (P5; `>=24` would reject working Node 20/22 hosts for no reason).
- [MED] lean-ctx "SHELL NOTE" in scaffold spec must not leak into committed docs. Agrees: added to DX-A1 (README must not mention it).
- [LOW] Mention `git commit --no-verify` for copy-only emergencies. Rejected: it teaches skipping type-check; README explains the hook instead.
- [LOW] `clear:auto-generated` copies the reference `src/stores/index.ts` path. Rejected after checking: that path is in the reference script, but `scaffold.spec.md` already specifies this repo's list (types/composables/utils barrels, d.ts, `auto-import.json`).
- [LOW] Renovate monthly grouped updates. Deferred (NOT in scope); README Upgrading lists the groups.
- Factual miss: it says the reference has no `.nvmrc`; it does (`v18`, verified with `ls -a`). No impact on findings.

### DX consensus table

```
  DX DUAL VOICES - CONSENSUS TABLE  [single-model: Codex unavailable]
  ===============================================================================
  Dimension                                Claude-primary  Claude-subagent  Codex  Consensus
  ---------------------------------------  --------------  ---------------  -----  ---------
  1. Getting started < 5 min (after fix)?  YES (<3 min)    YES (README)     N/A    CONFIRMED
  2. Script/content surface clear?         README map      README map/copy  N/A    CONFIRMED (no consolidation)
  3. Errors actionable?                    DX-A2, DX-A4    DX-A2 + localhost N/A   CONFIRMED (+DX-A6)
  4. Docs adequate?                        NO -> DX-A1     NO -> README     N/A    CONFIRMED
  5. Upgrade path credible?                README routine  Renovate         N/A    DISAGREE -> README now, Renovate deferred
  6. Dev env sound?                        engines >=20    engines >=24     N/A    DISAGREE -> >=20 (verified floor)
  7. Deploy artifact safe?                 head drift      prepare dist     N/A    CONFIRMED gaps; prepare -> UC-X1
  8. DX measured?                          timed QA check  none needed      N/A    CONFIRMED (DX-A5, light)
  ===============================================================================
```

### DX Scorecard

```
+====================================================================+
|              DX PLAN REVIEW - SCORECARD                             |
+====================================================================+
| Dimension            | Before | After  | Trend  |
|----------------------|--------|--------|--------|
| Getting Started      |  5/10  |  8/10  |  +3    |
| Scripts/content API  |  6/10  |  8/10  |  +2    |
| Error Messages       |  5/10  |  8/10  |  +3    |
| Documentation        |  2/10  |  8/10  |  +6    |
| Upgrade Path         |  4/10  |  6/10  |  +2    |
| Dev Environment      |  7/10  |  8/10  |  +1    |
| Community            |  3/10  |  6/10  |  +3    |
| DX Measurement       |  2/10  |  5/10  |  +3    |
+--------------------------------------------------------------------+
| TTHW                 | ~4 min owner / ~12 min contributor -> <3 min |
| Competitive Rank     | Needs Work -> Competitive                    |
| Magical Moment       | designed via README quick start + content map + build sync check |
| Product Type         | developer-maintained static site (repo DX)   |
| Mode                 | DX POLISH                                    |
| Overall DX           | 4.3/10 -> 7.1/10                             |
+====================================================================+
| DX PRINCIPLE COVERAGE                                               |
| Zero Friction      | covered (4-command quick start, engines)       |
| Learn by Doing     | covered (content map points at real files)     |
| Fight Uncertainty  | covered (guard message, sync check, troubleshooting) |
| Opinionated + Escape Hatches | covered (.env.example default, host override) |
| Code in Context    | covered (deploy + images + upgrade sections)   |
| Magical Moments    | covered (one edit, build verifies the rest)    |
+====================================================================+
```

Below-6 dimensions after fixes: DX Measurement (5) and Upgrade (6 borderline) are deliberate YAGNI ceilings for a solo brochure, not adoption blockers.

### TTHW assessment

- Current (plan as written): owner ~4 min (guesses scripts from habit, hits the env warning), contributor ~12 min (Red Flag: no README, Node guess, env confusion).
- Target: **< 3 min, clone -> site visible at localhost:5173**, 4 commands, zero console warnings. Budget: `nvm use` 5s, `npm install` incl. `prepare` 60-120s, `cp` 1s, `npm run dev` 2s.
- Verified by DX-A5 (timed fresh-clone QA check).

### DX Implementation Checklist

```
DX IMPLEMENTATION CHECKLIST
============================
[ ] Time to hello world < 3 min (clone -> localhost:5173)                 DX-A5
[ ] Installation is one command (npm install; prepare generates all)     Phase 3 TD1
[ ] First run produces meaningful output, zero warnings                  DX-A1 step 3
[ ] Magical moment: edit contact.ts, build verifies head facts            DX-A4
[ ] Every error message has problem + cause + fix + docs pointer          DX-A2, DX-A4
[ ] Script names guessable / described in one table                       DX-A1
[ ] Defaults: .env.example works for local builds unmodified              Phase 3 E-A2
[ ] Docs have copy-paste commands that work as-is                         DX-A1
[ ] Content map covers every editable fact incl. index.html duplicates    DX-A1
[ ] Upgrade routine documented                                            DX-A1
[ ] Node floor enforced (engines) and pinned (.nvmrc)                     DX-A3
[ ] TypeScript types included (content is typed constants)                existing
[ ] Works in CI/host build without special config beyond VITE_SITE_URL    DX-A1 Deploy
[-] Changelog / Renovate / community channel                              N/A (private brochure)
```

### Amendments (auto-decided; builders apply, specs unchanged)

- **DX-A1 (scaffold `README.md`, new owned file)** Write `README.md` (sections and content map exactly as Pass 4). Do NOT copy the reference README, and never mention the builder-machine lean-ctx `npm` alias (scaffold SHELL NOTE). Quick start is the 4-command block in Pass 1.
- **DX-A2 (scaffold `vite.config.ts`)** Replace the guard message with the problem + cause + fix text in Pass 3 #1. Add a comment line to `.env.example`: `# Absolute site origin, no trailing slash. Used for og:image, og:url, JSON-LD. Host sets the real domain.`
- **DX-A3 (scaffold `package.json`)** Add `"engines": { "node": ">=20" }` (vite-ssg 28.3.0 floor, verified). Keep `.nvmrc` `v24`.
- **DX-A4 (scaffold `vite.config.ts`)** In the same `ssgOptions` object add `onPageRendered(_route, renderedHTML)`: read the JSON-LD `telephone` and `sameAs[0]` from `renderedHTML`, compare to the first `href="tel:..."` and the first `facebook.com` href in the rendered body; on mismatch throw the Pass 3 #3 message. No import of `src/types` into the config (keeps Phosphor/Vue out of the config bundle); compare HTML to HTML. Plain string/regex, no new dependency.
- **DX-A6 (scaffold `vite.config.ts`)** In `onBeforePageRender`, after the unset check, `console.warn` (not throw) when the replaced head contains `//localhost` or `//127.0.0.1`: `[zcars] VITE_SITE_URL points at localhost. Fine for npm run preview; on the host set VITE_SITE_URL=https://<your-domain>.` README Deploy: never copy `.env.example` on the host.
- **DX-A5 (QA, test plan)** Fresh-clone CHECK follows README quick start verbatim from a clean copy, records wall time; pass < 3 min, zero `npm run dev` console warnings; plus negative checks: unset `VITE_SITE_URL` shows the DX-A2 text; changing only `PHONE_HREF` fails the build with the DX-A4 text.

### Amendments by spec file (builder index)

- **Amendment for scaffold.spec.md:** add `README.md` to Owned files and write it per DX-A1 (quick start, scripts table, content map, images, deploy, troubleshooting, upgrading, ownership placeholder; never copy the reference README). `package.json` gets `"engines": { "node": ">=20" }` (DX-A3). `vite.config.ts` `ssgOptions`: guard message per DX-A2, localhost warning per DX-A6, and a new `onPageRendered` head/body consistency check per DX-A4. `prepare` per UC-X1 only if the user accepts it. `.env.example` gets the one-line format comment (DX-A2). Order of work: write README last so script names and file paths match what was built. Acceptance adds: README quick start runs verbatim on a clean copy in < 3 min; build fails with the DX-A2 text when `VITE_SITE_URL` is unset and with the DX-A4 text when `PHONE_HREF` and JSON-LD disagree.
- **Amendment for content-and-base.spec.md:** no code change. Content file paths and export names are now a public contract listed in README; renaming any export in `src/types/*.ts` requires updating the README content map in the same change.
- **Amendment for design-tokens.spec.md:** no DX change.
- **Amendment for sections-top.spec.md:** no code change. Copy that stays inline in SFCs (hero h1/lead, services heading/lead) is listed in the README content map; keep it in these files (not moved to constants, P3).
- **Amendment for sections-bottom.spec.md:** no code change. Repaint, Team, Hiring, Visit lead and Footer tagline copy stay inline and are listed in the README content map.
- **Amendment for zcars-vue.spec.md:** Tooling adds `README.md` and `engines.node >=20`. Acceptance adds: "README quick start reaches localhost in < 3 min on a clean copy" and "build fails with an actionable message on missing `VITE_SITE_URL` or head/contact drift".

### Taste decisions (DX)

- **TD-X1 head/contact drift: build check (DX-A4) vs README map only.** Recommend the check (P1): the phone number is the single most likely edit and a stale JSON-LD `telephone` is silent and visible in Google. About 8 lines in the existing `ssgOptions`. Alternative (generate the head from `contact.ts` via a Vite html transform) rejected: more code, couples config to Vue-importing content files (P5).
- **TD-X2 barrel regeneration on new file during dev: README rule vs `configureServer` watcher in the index-generator plugin.** Recommend README rule (P3, mirror parity PR3; the reference has the same behavior and the owner already knows it).
- **TD-X4 localhost SITE_URL: warn vs throw.** Recommend warn (P3): local `build && preview` QA uses localhost by design; a throw would need an escape-hatch env var for QA.
- **TD-X3 README depth: single README vs README + CONTRIBUTING + docs/content.md.** Recommend single README (P3/P4, one place to look).

### User challenges (DX)

- **UC-X1 `prepare` output dir.** `prepare: husky && vite build` (binding TD1) writes a client-only, non-prerendered `dist/` with the literal `%VITE_SITE_URL%` on every `npm install`. It looks deployable and bypasses the SSG guard if uploaded by hand. Recommendation: `"prepare": "husky && vite build --outDir node_modules/.cache/zcars-prepare --emptyOutDir"` (same generation side effects, no fake `dist/`). Alternative if rejected: README Deploy warns that only `npm run build` output is deployable. Not auto-applied because it edits the literal of a user-approved decision.

### NOT in scope (DX)

- Renovate / Dependabot, CI pipeline, changelog: solo private brochure; revisit if a second maintainer joins.
- CMS or client self-edit (PR7).
- Starter-template extraction for future clients (CEO 10x, deferred).
- Windows-compatible `clear:auto-generated` (`rimraf`): persona is macOS; mirror parity.
- Changing the mirrored `eslint.config.js` cold-read: covered by `prepare` + Troubleshooting.

### What already exists (reuse)

`prepare: husky && vite build` (one-command install), `.env.example` default, the Phase 3 `ssgOptions` hook (DX-A4 extends it, no new mechanism), typed content constants (types act as the content schema), `.nvmrc`, committed lockfile, `vite --debug`, Phase 3 fresh-clone CHECK (DX-A5 extends it).

### Implementation Tasks (Phase 3.5)

- [ ] **T24 (P1, human: ~45min / CC: ~5min)** scaffold: write `README.md` per DX-A1. Verify: a clean copy reaches localhost:5173 following only the README.
- [ ] **T25 (P2, human: ~10min / CC: ~2min)** scaffold: DX-A2 guard text + `.env.example` comment; DX-A3 `engines`. Verify: unset env shows the new message.
- [ ] **T26 (P2, human: ~30min / CC: ~5min)** scaffold: DX-A4 `onPageRendered` consistency check. Verify: change only `PHONE_HREF` -> build fails with the message; restore -> passes.
- [ ] **T27 (P2, human: ~15min / CC: ~3min)** QA: DX-A5 timed fresh-clone + negative checks.

### Completion Summary (Phase 3.5)

```
  +====================================================================+
  |            DX PLAN REVIEW - COMPLETION SUMMARY                     |
  +====================================================================+
  | Step 0              | persona, narrative, benchmark, journey (9), roleplay |
  | Passes 1-8          | all evaluated; 0 skipped                      |
  | Overall DX          | 4.3 -> 7.1 /10                               |
  | TTHW                | ~4 / ~12 min -> < 3 min target                |
  | Amendments          | DX-A1..DX-A6; 4 taste; 1 user challenge       |
  | Outside voice       | Claude subagent ran; Codex unavailable        |
  | Unresolved          | 1 (UC-X1, user decides)                       |
  +====================================================================+
```

## Phase 4: Final Approval Gate — APPROVED (user delegated: "approve accordingly")

All recommendations accepted. User challenges resolved: UC1 vite-ssg ACCEPT · UC-D1 drop noscript ACCEPT · UC-E1 drop router scrollBehavior ACCEPT · UC-X1 prepare builds to node_modules/.cache/zcars-prepare ACCEPT. Taste decisions: all per recommendation (TD1, TD2, TD-D1..D4, TD-E1/E2, TD-X1..X4). Voices: subagent-only (codex unavailable in shell).

<!-- AUTONOMOUS DECISION LOG -->

## Decision Audit Trail

| #   | Phase  | Decision                                                                                                                                 | Classification | Principle | Rationale                                                                                           | Rejected                                                       |
| --- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1   | CEO    | Review mode SELECTIVE EXPANSION                                                                                                          | Mechanical     | P6        | Given by orchestrator; matches enhancement-of-existing-artifact default                             | EXPANSION, HOLD, REDUCTION                                     |
| 2   | CEO    | Approach A (plan + hardening) as baseline; B (prerender) surfaced as UC1                                                                 | Mechanical     | P6        | A respects approved specs; B changes user's mirrored bootstrap so it cannot be auto-taken           | C static HTML (contradicts user's Vue decision)                |
| 3   | CEO    | E1 add noscript block (name, tel:, FB) to index.html                                                                                     | Mechanical     | P2        | 1 file, in blast radius, closes blank-page-without-JS gap                                           | No fallback                                                    |
| 4   | CEO    | E2 always use stable public/og-image.webp + og:type, og:image:alt, twitter:card                                                          | Mechanical     | P5        | Hashed asset URL changes per build and breaks FB cache; explicit beats conditional                  | Conditional hashed og:image                                    |
| 5   | CEO    | E3 router scrollBehavior (saved, hash el, top)                                                                                           | Mechanical     | P1        | Cold-load /#visit otherwise lands at top since content mounts after native anchor scroll            | No scrollBehavior                                              |
| 6   | CEO    | reveal.ts creates IntersectionObserver lazily, not at import                                                                             | Mechanical     | P5        | Import-time browser API breaks SSR/SSG/Node; free to fix                                            | Module-level observer                                          |
| 7   | CEO    | TService as union (image xor icon)                                                                                                       | Mechanical     | P5        | Current optional+optional allows an invalid empty cell                                              | Two optional fields                                            |
| 8   | CEO    | TD1 cold-clone generation: recommend prepare runs husky && vite build                                                                    | Taste          | P3        | eslint reads gitignored auto-import.json; type-check needs gitignored barrel                        | existsSync guard; docs-only note                               |
| 9   | CEO    | TD2 Address fact links to Google Maps directions                                                                                         | Taste          | P1        | Highest-value CTA for a garage, map-failure fallback, data-only change; deviates from 1:1           | Plain text address                                             |
| 10  | CEO    | UC1 prerender with vite-ssg                                                                                                              | User Challenge | P1        | Restores static-page parity (no-JS, deep links, LCP, SEO); alters mirrored bootstrap                | Pure client-side SPA                                           |
| 11  | CEO    | PR5 host + domain undefined: sent to premise gate                                                                                        | Premise (gate) | P1        | og:image/og:url and JSON-LD url need absolute URLs; FB previews are main channel                    | Treat deploy as out of scope                                   |
| 12  | CEO    | E6 opening hours deferred to TODOS                                                                                                       | Mechanical     | P5        | Not in source data; never guess                                                                     | Invent hours                                                   |
| 13  | CEO    | E7 JSON-LD url/image/geo/streetAddress deferred                                                                                          | Mechanical     | P5        | Needs domain and verified address                                                                   | Guessing values                                                |
| 14  | CEO    | E8 Messenger m.me deep link deferred                                                                                                     | Mechanical     | P5        | Page username for profile.php id unverified                                                         | Unverified link                                                |
| 15  | CEO    | E9 analytics + tel-click metric deferred                                                                                                 | Mechanical     | P3        | Needs host and client consent                                                                       | Add now                                                        |
| 16  | CEO    | Keep vite-plugin-vue-devtools in plugin list (not in reference config)                                                                   | Mechanical     | P3        | Serve-only, harmless, in reference deps                                                             | Drop it                                                        |
| 17  | CEO    | Keep full tooling mirror unchallenged                                                                                                    | Mechanical     | P6        | Explicit user decision; cost noted in Section 10                                                    | Trim router/barrels                                            |
| 18  | CEO    | No error-monitoring SDK                                                                                                                  | Mechanical     | P3        | YAGNI for a static brochure                                                                         | Sentry                                                         |
| 19  | CEO    | No font preload plugin                                                                                                                   | Mechanical     | P3        | fontsource swap default adequate; revisit if QA shows FOUT/CLS                                      | Preload plugin                                                 |
| 20  | CEO    | Add JS-off, cold-hash, 320px, both-scheme, reduced-motion cases to QA checklist; no test framework                                       | Mechanical     | P3        | Covers hostile cases without new deps (PR6)                                                         | Vitest/Playwright suite                                        |
| 21  | CEO    | Confirm Team caption fix (clip moves to inner div)                                                                                       | Mechanical     | P6        | User already chose to show caption; spec implements it correctly                                    | Reference clipping                                             |
| 22  | Design | Skip mockup generation; reference page is the approved visual                                                                            | Mechanical     | P5        | Variants against a locked 1:1 contract invite drift                                                 | Generate 3 variants                                            |
| 23  | Design | No DESIGN.md / design-consultation                                                                                                       | Mechanical     | P4        | Reference + tokens spec already form the system; avoid second source of truth                       | Create DESIGN.md                                               |
| 24  | Design | D-A1 reveal skips in-view elements, all work in mounted                                                                                  | Mechanical     | P1        | Prerender hydration otherwise blinks in-view blocks on deep links                                   | Accept re-reveal (Phase 1 note)                                |
| 25  | Design | D-A2 map loading/blocked layer with Open in Google Maps link                                                                             | Mechanical     | P1        | Missing state; blocked iframe left a silent empty box                                               | Empty panel                                                    |
| 26  | Design | D-A3 bg-surface on hero figure + team image wrapper                                                                                      | Mechanical     | P1        | Missing image-failure state; invisible when image loads                                             | Transparent frames                                             |
| 27  | Design | D-A4 scroll-mt-nav on main#top                                                                                                           | Mechanical     | P1        | Logo click scrolled down 68px, eyebrow hidden under sticky header                                   | Keep reference bug                                             |
| 28  | Design | D-A5 focus ring selector a:focus-visible -> :focus-visible                                                                               | Mechanical     | P1        | Approved focusable partners region had no house focus ring                                          | Per-element ring classes                                       |
| 29  | Design | D-A6 gate active:scale under motion-safe                                                                                                 | Mechanical     | P1        | Completes approved reduced-motion transform gating                                                  | Ungated active scale                                           |
| 30  | Design | D-A7 scrollBehavior without behavior key; CSS decides smooth                                                                             | Mechanical     | P5        | Keeps reduced motion honored on router scrolls                                                      | behavior: smooth                                               |
| 31  | Design | D-A8 spacing.nav 68px token                                                                                                              | Mechanical     | P4        | Magic number in 3 places                                                                            | Repeated arbitrary values                                      |
| 32  | Design | D-A9 MAP_DIRECTIONS_URL exact Maps URLs API value                                                                                        | Mechanical     | P5        | Two builders would invent different URLs                                                            | Unspecified URL                                                |
| 33  | Design | D-A10 QA adds 320/768/1024, blocked map, throttled images, tab pass, single montero request                                              | Mechanical     | P1        | Hostile states otherwise unverified                                                                 | 390/1440 only                                                  |
| 34  | Design | D-A11 accept build year in prerendered footer; hydration corrects                                                                        | Mechanical     | P3        | Harmless; no extra code                                                                             | onMounted year ref                                             |
| 35  | Design | D-A12 builder notes: ghost color vs ghost button; row-span :class is fixed per item                                                      | Mechanical     | P5        | Removes two implementer ambiguities                                                                 | Silent                                                         |
| 36  | Design | D-A13 vite-ssg bootstrap rewrite of main.ts/router.ts routed to Eng phase                                                                | Mechanical     | P6        | Approved change not yet reflected in scaffold spec; eng owns bootstrap                              | Design specifies bootstrap                                     |
| 37  | Design | D-A14 underline every fact with href                                                                                                     | Mechanical     | P5        | Address becomes a link (TD2); old rule said two links                                               | Two-link rule                                                  |
| 38  | Design | D-A15 scrim threshold from-40%, cap from-50%                                                                                             | Mechanical     | P5        | Escape hatch had no bound                                                                           | Unbounded                                                      |
| 39  | Design | TD-D1 Tailwind hoverOnlyWhenSupported                                                                                                    | Taste          | P1        | Sticky hover after tap on touch                                                                     | Plain hover                                                    |
| 40  | Design | TD-D2 sr-only "(opens in new tab)" on 4 external links                                                                                   | Taste          | P1        | SR users warned; zero visual change                                                                 | No warning                                                     |
| 41  | Design | TD-D3 font preload stays deferred, QA-gated on CLS > 0.1                                                                                 | Taste          | P3        | Subagent says preload now; measure first                                                            | Preload now                                                    |
| 42  | Design | TD-D4 eyebrow as #visit link: recommend reject                                                                                           | Taste          | P5        | Unstyled link breaks clickability signal; changes hero                                              | Link eyebrow                                                   |
| 43  | Design | UC-D1 drop noscript block now that prerender is approved                                                                                 | User Challenge | P4        | Duplicates full no-JS page content; was decided before UC1                                          | Keep noscript                                                  |
| 44  | Design | Keep contract deviations from landing hard rules (split rounded hero, H1 = promise)                                                      | Mechanical     | P5        | User-verified design; local-service conversion pattern                                              | Full-bleed brand-first hero                                    |
| 45  | Design | Owner content notes (hours, supervised OJT copy, mid-page CTA) logged with PR1, not builder work                                         | Mechanical     | P5        | Content decisions; never guess                                                                      | Builders edit copy                                             |
| 46  | Eng    | Resolve bootstrap: `export const createApp = ViteSSG(App, { routes }, setup, { hydration: PROD, useHead: false })`; delete src/router.ts | Mechanical     | P5        | vite-ssg requires `createApp` export and owns router creation                                       | createApp+isReady bootstrap; vite-ssg/single-page (breaks PR3) |
| 47  | Eng    | Client hydration on in prod                                                                                                              | Mechanical     | P1        | Default re-render replays hero animation and swaps DOM                                              | hydration false                                                |
| 48  | Eng    | Static index.html owns head; useHead false                                                                                               | Mechanical     | P4        | One head source; no useHead calls                                                                   | @unhead/vue useHead                                            |
| 49  | Eng    | VITE_SITE_URL build guard in ssgOptions.onBeforePageRender + .env.example                                                                | Mechanical     | P1        | Vite leaves unset %VAR% literal; closes og:image CRITICAL GAP loudly                                | Silent literal; committed .env.production with guessed domain  |
| 50  | Eng    | Scripts: build-only `vite-ssg build`, prepare `husky && vite build`, vite-ssg ^28.3.0, vue ^3.5.17                                       | Mechanical     | P5        | Verified peers/engines; prepare per gate                                                            | vite build only                                                |
| 51  | Eng    | Ignore .vite-ssg-temp in git + eslint                                                                                                    | Mechanical     | P1        | Failed build leaves SSR bundle that breaks lint                                                     | No ignore                                                      |
| 52  | Eng    | Footer data-allow-mismatch="text" (supersedes D-A11)                                                                                     | Mechanical     | P1        | Vue prod logs console.error on year mismatch                                                        | Accept mismatch                                                |
| 53  | Eng    | TD-D1 written as `future.hoverOnlyWhenSupported`                                                                                         | Mechanical     | P5        | Verified future flag in Tailwind 3.4.17                                                             | experimental key                                               |
| 54  | Eng    | QA runs on `npm run preview` of SSG build; test plan artifact written                                                                    | Mechanical     | P1        | Dev server does not prerender                                                                       | QA on dev                                                      |
| 55  | Eng    | TD-E1 hydration gated on import.meta.env.PROD                                                                                            | Taste          | P5        | Dev has empty #app; `true` only adds a warning                                                      | Always true                                                    |
| 56  | Eng    | TD-E2 guard in typed ssgOptions hook                                                                                                     | Taste          | P5        | Typed, cross-platform                                                                               | postbuild grep                                                 |
| 57  | Eng    | UC-E1 drop router scrollBehavior (E3/D-A7)                                                                                               | User Challenge | P1        | Prerender scrolls natively; scrollBehavior forces scrollRestoration manual and breaks Back position | Keep scrollBehavior                                            |
| 58  | Eng    | Reject subagent cuts (single-page SSG, barrels, sass, devtools, commit generated files)                                                  | Mechanical     | P6        | Contradict PR3 full mirror and gate TD1                                                             | Cut tooling                                                    |
| 59  | Eng    | Font preload path = install beasties if TD-D3 gate trips                                                                                 | Mechanical     | P3        | vite-ssg auto-enables beasties with preloadFonts                                                    | Hand-written hashed preload                                    |
| 60  | DX     | Persona: owner-developer + future content contributor; mode DX POLISH; TTHW target < 3 min clone to localhost                            | Mechanical     | P6        | Given by orchestrator; Competitive tier, install time bounds Champion                               | Champion < 2 min                                               |
| 61  | DX     | DX-A1 README.md (quick start, scripts, content map incl. index.html duplicates, images, deploy, troubleshooting, upgrading)              | Mechanical     | P1        | No docs; reference README is boilerplate with a nonexistent script                                  | Copy reference README; no README                               |
| 62  | DX     | DX-A2 guard message = problem + cause + fix + "not needed for dev"; .env.example format comment                                          | Mechanical     | P5        | Phase 3 text lacked cause and value format                                                          | Keep short message                                             |
| 63  | DX     | DX-A3 engines.node >=20 alongside .nvmrc v24                                                                                             | Mechanical     | P5        | Verified vite-ssg floor; hosts ignore .nvmrc                                                        | engines >=24 (subagent)                                        |
| 64  | DX     | DX-A4 onPageRendered check: JSON-LD telephone/sameAs vs body tel:/facebook hrefs                                                         | Taste (TD-X1)  | P1        | Phone duplicated in index.html head; silent stale JSON-LD                                           | README map only; generate head from contact.ts                 |
| 65  | DX     | DX-A5 timed fresh-clone QA check + negative guard/sync checks                                                                            | Mechanical     | P1        | Makes TTHW measurable without CI                                                                    | CI pipeline                                                    |
| 66  | DX     | DX-A6 console.warn when VITE_SITE_URL is localhost in build                                                                              | Taste (TD-X4)  | P3        | .env.example copied on a host ships localhost og URLs; preview QA needs localhost                   | Throw + escape-hatch env                                       |
| 67  | DX     | TD-X2 README rule for restarting dev after adding a barreled file                                                                        | Taste          | P3        | Mirror parity PR3                                                                                   | configureServer watcher in plugin                              |
| 68  | DX     | TD-X3 single README, no CONTRIBUTING/docs split                                                                                          | Taste          | P4        | One place to look                                                                                   | Multiple doc files                                             |
| 69  | DX     | UC-X1 prepare builds into node_modules/.cache/zcars-prepare                                                                              | User Challenge | P1        | Install leaves a fake, unguarded dist/; edits binding TD1 literal                                   | Leave dist/ from prepare                                       |
| 70  | DX     | Reject subagent: copy.ts consolidation, --no-verify tip, clear:auto-generated fix (spec already correct); Renovate deferred              | Mechanical     | P3        | Specs partition copy; skip-hook advice harmful; claim verified false                                | Apply all                                                      |

## Premise Gate (Phase 1) — approved by user delegation ("approve accordingly")

PR1 accept (owner to confirm hiring/partners copy) · PR2 accept · PR3 accept · PR4 REJECTED → UC1 accepted (vite-ssg prerender) · PR5 REJECTED → plan for absolute URLs via VITE_SITE_URL env + stable public/og-image.webp, domain TBD by owner · PR6 accept · PR7 accept.
TD1 accept: `"prepare": "husky && vite build"` · TD2 accept: Address fact links to Google Maps directions.
