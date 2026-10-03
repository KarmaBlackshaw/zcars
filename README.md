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
| `npm run check:hours`                                    | Check the opening-hours logic                    |
| `npm run clear:auto-generated` then `npm run build-only` | Regenerate barrels, d.ts and `auto-import.json`  |

- `prepare` runs on `npm install` and builds into `node_modules/.cache/zcars-prepare` only to generate types; only `npm run build` output is deployable. It runs a full vite build, so invalid content also fails `npm ci`.
- The pre-commit hook runs a full `type-check` (~10 s), then lint-staged.

## Content: use /admin

The owner edits the site at `https://<domain>/admin/`: log in with GitHub, edit, save. Each save commits to `master` and Netlify publishes in about 1 to 2 minutes.

- A bad edit fails the build and the live site keeps the last good version. The build log names the file and the field.
- Deleting a service that a project still uses fails the build. Remove it from the project first.
- Do not rename slugs (file names) after creating an entry.
- Content lives as JSON in `src/content/`, validated by zod at build time (`plugins/content.ts`).

### One-time setup (owner)

1. Create a GitHub OAuth App with callback URL `https://api.netlify.com/auth/done`.
2. In Netlify, go to Site settings, Access control, OAuth, GitHub, and add the OAuth App.
3. Invite the client as a collaborator on `KarmaBlackshaw/zcars`.
4. In Netlify, go to Site configuration, Forms, and choose Enable form detection. Then go to Deploys and choose Trigger deploy so Netlify registers the prerendered `quote` form. Without this, submissions are silently dropped.
5. Under Forms, Form notifications, add an email notification for the `quote` form.
6. Check the Forms plan limits: monthly submissions, and Netlify's 8 MB per-submission cap, which is why the quote form accepts photos up to 7 MB.
7. Confirm the Messenger link opens the page chat.

## Images

Images are uploaded in the CMS to `public/uploads/` (converted to webp, max 2048px). `src/assets/images/logo.webp` and `public/favicon.png` stay in code: replace the file and update `width`/`height` where the component lists them.

## Deploy

Netlify reads `netlify.toml` (build command, `dist`, `VITE_SITE_URL`), which overrides the dashboard build settings. Change the domain there if it moves. Other hosts:

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
| `Content is invalid`                                                         | Read the listed file and field, then fix it in `/admin`            |
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
