# Zcars

## What it is

Prerendered one-page site for Zcars Auto Detailing Garage (Sagkahan, Tacloban City), built with Vue 3 + vite-ssg. `docs/reference/index.html` is the visual and copy contract.

## Prerequisites

- Node 24 via `.nvmrc` (Node >=20 is required, see `engines` in `package.json`)
- npm

## Quick start

```sh
nvm use
npm install                   # also generates types, barrels, d.ts
cp .env.example .env.local    # VITE_SITE_URL for local builds
npm run dev                   # http://localhost:5173
```

## Scripts

| Script                                                   | What it does                                     |
| -------------------------------------------------------- | ------------------------------------------------ |
| `npm run dev`                                            | Dev server with HMR, no prerender                |
| `npm run build`                                          | vite-ssg prerender into `dist/`, then type-check |
| `npm run preview`                                        | Serve `dist/`; use this to check production      |
| `npm run lint`                                           | ESLint + Prettier, autofixes                     |
| `npm run type-check`                                     | `vue-tsc` over the app                           |
| `npm run clear:auto-generated` then `npm run build-only` | Regenerate barrels, d.ts and `auto-import.json`  |

- `prepare` runs on `npm install` and builds into `node_modules/.cache/zcars-prepare` only to generate types; only `npm run build` output is deployable.
- The pre-commit hook runs a full `type-check` (~10 s), then lint-staged.

## Edit content

| To change                           | Edit                                                            | Also edit                                                                 |
| ----------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Phone                               | `src/types/contact.ts` `PHONE_DISPLAY`, `PHONE_HREF`            | `index.html` JSON-LD `telephone` (build checks); meta description by hand |
| Facebook page                       | `src/types/contact.ts` `FACEBOOK_URL`                           | `index.html` JSON-LD `sameAs` (build checks)                              |
| Business name                       | `src/types/contact.ts` `BUSINESS_NAME`                          | `index.html` `<title>`, `og:title`, JSON-LD `name`                        |
| Map / directions                    | `src/types/contact.ts` `MAP_EMBED_URL`, `MAP_DIRECTIONS_URL`    | none                                                                      |
| Services (cards)                    | `src/types/service.ts` `SERVICES`                               | none (first entry is the tall cell)                                       |
| Nav links                           | `src/types/navigation.ts` `NAV_LINKS`                           | section `id` in `src/components/Home/*`                                   |
| Partner names                       | `src/types/partner.ts` `PARTNER_NAMES`                          | `src/assets/images/partners.webp` (logo strip image)                      |
| Hero / repaint / team / hiring copy | `src/components/Home/{Hero,Repaint,Team/index,Team/Hiring}.vue` | none                                                                      |
| Footer tagline                      | `src/components/Layout/Footer.vue`                              | none                                                                      |
| Share preview text/image            | `index.html` `og:*`, `public/og-image.webp`                     | none                                                                      |

"Build checks" means `npm run build` fails if the `index.html` copy and the page links disagree. Renaming any `src/types/*.ts` export requires updating this table.

## Images

Replace `src/assets/images/<name>.webp` and update `width`/`height` where the component lists them. `public/og-image.webp` is a separate copy used for link previews; replace it too if the share image should change.

## Deploy

Host-agnostic:

- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_SITE_URL=https://<your-domain>` (no trailing slash)
- Node version: from `.nvmrc`
- devDependencies must be installed at build time: no `--omit=dev` and no `NODE_ENV=production` during install.
- Never copy `.env.example` on the host; set `VITE_SITE_URL` in the host's build environment.

## Troubleshooting

| Symptom                                                                      | Fix                                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `ENOENT ... auto-import.json` or `Cannot find module '@/types'`              | `npm run build-only`                                               |
| `VITE_SITE_URL is not set`                                                   | Quick start step 3 locally, or set it in the host env (see Deploy) |
| `head is out of sync`                                                        | Update `index.html` per the Edit content table                     |
| Added a file to `src/types`, `src/composables` or `src/utils` while dev runs | Restart `npm run dev`                                              |

## Upgrading

1. `npm outdated`
2. Bump one group at a time:
   - vite + plugins + vite-ssg
   - vue + vue-router + unplugin-vue-router
   - eslint group
3. After each group: `npm run clear:auto-generated && npm run build && npm run lint && npm run preview`
4. Never use `--force`.

## Ownership

- Host: _TBD by owner_
- Domain: _TBD by owner_
- Who to ask: _TBD by owner_
