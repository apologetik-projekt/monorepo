# AGENTS Guide — Apologetik Monorepo

## Snapshot
- pnpm-managed monorepo with a Next.js 15 App Router frontend (`apps/website`) and a Payload CMS 3.57 backend (`packages/payload`).
- Node.js ≥ 22.18 and pnpm ≥ 10.14 are required; all packages enforce pnpm via `preinstall` scripts.
- Strict TypeScript configuration is shared from the repo root; both packages extend it and rely on project references.
- Sentry (web + CMS) and Plausible analytics are wired in but stay inert locally unless credentials are present.
- Tailwind CSS 4 provides styling; custom fonts, typography, and utility tweaks live in `apps/website/tailwind.config.mjs`.

## Repository Map
- Root: `package.json`, `tsconfig.json`, `eslint.config.mjs`, and `pnpm-workspace.yaml` define shared tooling. No root-level build scripts exist beyond dependency management.
- `apps/website/`
  - Next.js entrypoint. Uses the App Router with route groups: `(frontend)` for public pages, `(payload)` for admin overrides.
  - `app/api/` exposes serverless endpoints (`/health`, `/altcha`).
  - `components/` hosts reusable UI with `components/blocks/*` mirroring Payload block schemas.
  - `utilities/` contains formatting, payload helpers, and view-transition utilities.
  - Sentry instrumentation lives in `instrumentation.ts` / `instrumentation-client.ts`; `withPayload` and Plausible proxying are configured in `next.config.ts`.
  - Global styles and Tailwind layers sit in `styles/` plus `postcss.config.mjs`.
- `packages/payload/`
  - All CMS configuration (`payload.config.ts`) and exports consumed via the workspace alias `@repo/payload` and Next alias `@payload-config`.
  - Domain folders: `collections/`, `blocks/`, `fields/`, `globals/`, `access/`, `utilities/`, and `plugins/`.
  - `migrations/` defines the generated Payload migration bundle exposed through `migrations/index.ts`.
  - `docker-compose.yml` spins up a local Postgres instance (volume `pgdata`).

## Tooling & Environment
- Install dependencies from the repo root: `pnpm install`.
- Copy `apps/website/.env.example` and populate at least `DATABASE_URI`, `PAYLOAD_SECRET`, `ALTCHA_HMAC_KEY`, and `NEXT_PUBLIC_SERVER_URL`. Optional SMTP + Azure storage variables enable email and blob storage adapters.
- The CMS also reads `DB_*` fallbacks if `DATABASE_URI` is absent (`packages/payload/utilities/database.ts`).
- Start Postgres locally with `pnpm --filter=payload db:start`; stop with `pnpm --filter=payload db:stop`. The service uses Docker and binds to port 5432.
- To run Payload CLI actions (admin UI, migrations, seeds), use `pnpm --filter=payload payload [...args]`. Example: `pnpm --filter=payload payload migrate`.
- Launch the frontend dev server after the database is up: `pnpm --filter=website dev`. Production build/start: `pnpm --filter=website build` then `pnpm --filter=website start`.
- Linting is handled with `pnpm --filter=website lint`. There is currently no automated test suite; rely on lint/build plus manual verification.

## Website Notes (`apps/website`)
- Uses `@payloadcms/next/withPayload` to share a single Payload instance between API routes and Components. Be mindful of server vs client component boundaries—files under `app/**` are server components by default.
- `app/(frontend)/(sitemaps)` exposes dynamic sitemap routes that cache via `revalidateTag`; keep tags in sync with Payload hooks.
- `next-view-transitions` is used in routing (see `components` and `app/(frontend)/blog/page.tsx`). Preserve `viewTransitionName` attributes when refactoring animations.
- API routes: `/api/health` responds with a simple status for uptime monitors; `/api/altcha` issues & validates Altcha CAPTCHA challenges using `ALTCHA_HMAC_KEY`.
- Images are optimized via `next/image` with remote patterns derived from `NEXT_PUBLIC_SERVER_URL`. Update `next.config.ts` if new asset origins are introduced.
- Styling: Tailwind 4 utility-first classes dominate; custom tokens such as `fontFamily.mono` and `lineHeight['super-tight']` are in use. Avoid ad-hoc CSS—extend the Tailwind config if new design tokens are required.

## Payload Notes (`packages/payload`)
- Collections: `Pages`, `Posts`, `Authors`, `Tags`, `Media`, and `Users`. Hooks in `collections/*/hooks.ts` handle Next.js ISR revalidation (`revalidatePath`, `revalidateTag`) and computed fields (e.g., post reading time).
- Access helpers in `access/` implement role-based gating (`authenticated`, `isAdmin`, `authenticatedOrPublished`). Ensure new collections reuse these utilities for consistency.
- Blocks: definitions in `blocks/` power both the CMS and frontend components. Adding a block requires changes in Payload (schema + admin fields) and the corresponding renderer in `apps/website/components/blocks`.
- Plugins: SEO (`plugins/seo.ts`), form builder, redirects, Azure Blob storage, search, and Sentry. Many plugins depend on optional env vars (e.g., Azure storage credentials, `SENTRY_AUTH_TOKEN`). Provide safe fallbacks when wiring new integrations.
- Email transport defaults to a console logger (`consoleMailer()`) unless SMTP variables are present. Keep this fallback in mind for local development.
- Database config uses the Postgres adapter with migrations stored in `migrations/`. Generate new migrations through the Payload CLI so they register in `migrations/index.ts`.

## Agent Workflow Tips
- Favor TypeScript-first changes; strict mode and `noUncheckedIndexedAccess` are enabled. Update types (`packages/payload/types.d.ts`) when adjusting schemas so the frontend stays in sync.
- Respect workspace boundaries: run scripts with `pnpm --filter=<package>` to avoid cross-package noise.
- Coordinate CMS changes with frontend expectations. Pages/posts rely on ISR tags (`posts-sitemap`, etc.); adjust both hook constants and Next routes together.
- Keep Sentry DSNs and auth tokens out of source control. The code already tolerates missing credentials—do not introduce required references without guarded checks.
- Avoid editing generated artifacts (`apps/website/dist`, `packages/payload/types.d.ts`, migration `.json` snapshots) unless intentionally regenerating them.
- When adding dependencies, ensure they are scoped to the relevant workspace. Use `pnpm add <pkg> --filter website` (or `payload`) instead of modifying root dependencies.

## Reference Material
- Root `README.md` gives onboarding steps in German.
- `apps/website/README.md` documents local setup for the frontend.
- Payload docs: https://payloadcms.com/docs, Next.js docs: https://nextjs.org/docs for deeper integration details.
