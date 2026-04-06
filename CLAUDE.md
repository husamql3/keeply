# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build + type-check (vite build && tsc --noEmit)
npm run preview   # Preview production build
npm run format    # Lint + format (oxlint && oxfmt --write)
npm start         # Run built server (.output/server/index.mjs)
```

Docker (via Makefile):

```bash
make dev    # Start all services with live reload
make up     # Start services detached
make down   # Stop services
make logs   # Tail logs
```

No test runner is configured.

## Architecture

**Keeply** is a bookmark manager SaaS (currently showing a waitlist landing page). It recently migrated from Next.js to TanStack Start.

### Stack

- **Framework**: TanStack Start v1 (full-stack, Vite-based) + Nitro server
- **Routing**: TanStack Router — file-based, auto-generated route tree at `src/routeTree.gen.ts`
- **Data fetching**: TanStack Query v5
- **Auth**: Better-Auth (OAuth: Google, GitHub, Twitter + email OTP)
- **Database**: Drizzle ORM + PostgreSQL
- **Forms**: React Hook Form + Zod v4
- **Styling**: Tailwind CSS v4 (via Vite plugin)
- **Error tracking**: Sentry (browser only, production)
- **Package manager**: Bun

### Key Conventions

- **Path alias**: `@/*` → `src/*`
- **Formatter**: OxFmt (tabs, width 120, trailing commas always). Import order: side-effects → builtin → external → internal → parent → sibling → index
- **Linter**: OxLint. Ignores `src/router.tsx` and `src/routeTree.gen.ts`
- **UI components**: Custom Shadcn-style primitives in `src/components/ui/`
- **`cn()`**: `clsx` + `tailwind-merge` helper in `src/lib/utils.ts`

### Route Structure

Routes live in `src/routes/` and map directly to URLs:

- `__root.tsx` — root layout (sets up Sentry, QueryClient provider)
- `_pathlessLayout.tsx` — layout wrapper without contributing a path segment
- `api/*.ts` — server-side API handlers (Nitro), e.g. `api/join-wishlist.ts`
- Dynamic segments use `$param` naming (e.g. `posts.$postId.tsx`)

`src/routeTree.gen.ts` is auto-generated — do not edit manually.

### Environment Variables

Typed via `t3-env` + Zod in `src/env.ts`. Server vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, OAuth client IDs/secrets, `EMAIL_USER`/`EMAIL_PASSWORD`. Client vars (must be prefixed `VITE_`): `VITE_SENTRY_DSN`.
