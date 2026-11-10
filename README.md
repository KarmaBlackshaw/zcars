# Zcars

## What it is

Prerendered one-page site for Zcars Auto Detailing Garage (Sagkahan, Tacloban City), built with Vue 3 + vite-ssg. `docs/reference/index.html` is the visual and copy contract.

## Prerequisites

- Node 24 via `.nvmrc` (Node >=20 is required, see `engines` in `package.json`)
- npm

## Quick start

```sh
nvm use
cp .env.example .env.local    # then fill the Supabase URL/key from Netlify env vars; npm install builds, so do this first
npm install                   # also generates types, barrels, d.ts
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
| `npm run check:hours`                                    | Check the opening-hours logic                    |
| `npm run clear:auto-generated` then `npm run build-only` | Regenerate barrels, d.ts and `auto-import.json`  |

- `prepare` runs on `npm install` and builds into `node_modules/.cache/zcars-prepare` only to generate types; only `npm run build` output is deployable. It runs a full vite build, so invalid content also fails `npm ci`.
- The pre-commit hook runs a full `type-check` (~10 s), then lint-staged.

## Content: Supabase

All content lives in the Supabase project `zcars` (`tmggonbqvkolagmzwtpe`). The owner edits rows in the Table Editor. Each save triggers a Netlify rebuild, live in about 1 to 2 minutes.

| Table                            | What it holds                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `site`, `opening_hours`, `seo`   | Name, phone, Messenger/Facebook links, address, hours, page title and link preview                                     |
| `home`                           | Page copy: headline, section titles and leads, contact text, team blurb                                                |
| `services`, `projects`, `promos` | Service cards, recent work, promos (`ends_on` hides a promo after that date)                                           |
| `reviews`, `faqs`, `partners`    | Reviews (shown only when the row has a `source_url`), questions, product brands (as logos under `home.partners_title`) |
| `stats`, `hiring_roles`          | `stats` is no longer shown; open roles (no rows hides the roles block)                                                 |
| `quotes`                         | Quote requests from the site. Photos are in the `quote-photos` bucket (`photo_path`)                                   |

- The home process band's before/after card shows the newest project with a `before_photo`. Other before/after projects appear in the work grid instead.
- A service page's hero is the full-width photo of the newest project tagged with that service (its first photo; with no tagged project, the service's own `photo`). The next tagged project that has a `before_photo` is that page's before/after card in the band and is not repeated in its work grid. If no other tagged project has one, the hero project's own before/after becomes the band card.
- The first active promo (lowest `position`) shows as the gold line in the top bar and as the promo card, the 4th card in the work grid. Other active promos are not shown.
- A bad edit fails the build and the live site keeps the last good version. The build log names the table and the row.
- Do not rename a service `slug` that a project lists in `services`; the build fails until the project is updated.
- Rows are validated by zod at build time (`plugins/content.ts`); locally, restart `npm run dev` to see Supabase edits.
- Partners show as a logo grid in order of `name`, which is alphabetical today.
- The `stats` table and the `home.warranty_*` fields are not shown on the page.
- Reviews show only when the row has a `source_url`. Delete the "Sample customer" rows, then add real reviews with their links.

### Search (SEO)

- Each service gets its own page at `/services/<slug>`, titled "<Service> in <city> | <site name>". Its text comes from the `services` row: `page_description` (Google snippet, max 160 characters), `intro`, `includes` (bullet list) and `faqs` (a JSON list of `{"question", "answer"}`). Empty fields fall back to the `summary` or hide their section.
- `home.hero_title` and `home.hero_title_accent` are the home page's main heading (the accent on its own blue line). `home.hero_heading`, `home.services_title` and `home.services_lead` are not shown on the page.
- `site.city`, `region`, `postal_code`, `latitude`, `longitude` and `google_maps_url` feed the business details Google reads. Copy the pin from the shop's Google Maps listing.
- The build writes `sitemap.xml` and `robots.txt`. Submit `https://<domain>/sitemap.xml` once in Google Search Console.

### Images

Upload to the public `uploads` Storage bucket (webp, max 2048px), copy its public URL, paste it into the row. The build downloads every project, service and team photo and serves WebP copies at 480, 800, 1200 and 1600px wide (never wider than the upload) from `/images/content/`, so each page picks the size it needs. Widths and quality are set in `plugins/images.ts`; a photo URL that does not load fails the build. The logo lives at `public/logo.webp` (served at `/logo.webp`; the nav, footer and business structured data use it). `public/favicon.png` stays in code. The home hero photo is the first photo of the project whose slug is in `src/constants/hero.ts`. `site.tagline` is the giant wordmark in the footer, the first word of `site.name` is the header wordmark, and each service's `icon` picks its icon in the service strip.

### One-time setup (owner)

1. In Netlify, go to Site configuration, Build & deploy, Build hooks, and add a hook for `master`. Copy its URL.
2. In Supabase, open the SQL editor and run `select vault.create_secret('<build hook URL>', 'netlify_build_hook');`. Until then, content edits only go live on the next deploy.
3. Check new requests in the `quotes` table. Nothing emails you yet.
4. Confirm the Messenger link opens the page chat.

## Deploy

Netlify reads `netlify.toml` (build command, `dist`, redirects), which overrides the dashboard build settings. `VITE_SITE_URL` and the Supabase URL and publishable key are set in Netlify under Project configuration, Environment variables; change the domain there if it moves. Env values are never committed. Other hosts:

- Build command: `npm run build`
- Output directory: `dist`
- Environment: `VITE_SITE_URL=https://<your-domain>` (no trailing slash), `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Node version: from `.nvmrc`
- devDependencies must be installed at build time: no `--omit=dev` and no `NODE_ENV=production` during install.
- Never copy `.env.example` on the host; set `VITE_SITE_URL` in the host's build environment.

## Troubleshooting

| Symptom                                                                      | Fix                                                                     |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `ENOENT ... auto-import.json` or `Cannot find module '@/types'`              | `npm run build-only`                                                    |
| `VITE_SITE_URL is not set`                                                   | Quick start step 3 locally, or set it in the host env (see Deploy)      |
| `Content is invalid`                                                         | Read the listed table and row, then fix it in the Supabase Table Editor |
| `VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are not set`            | Quick start step 2 locally; set them in Netlify env vars on Netlify     |
| Added a file to `src/types`, `src/composables` or `src/utils` while dev runs | Restart `npm run dev`                                                   |

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
