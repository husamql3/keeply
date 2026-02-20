# Bookmark App — Technology Stack

**Recommended Architecture · February 2026**

---

## Stack Philosophy

TypeScript throughout the entire codebase eliminates type mismatches between frontend and backend. The client is built with React + Vite and served as static files directly from the Express server, keeping deployment simple — one Docker container, no separate CDN origin needed. Bun replaces Node.js as the runtime and package manager for significantly faster installs and script execution. All choices prioritize developer velocity in Phases 1–2, with clear upgrade paths for Phase 3–4 scale.

**Estimated MVP infra cost (<1k users): $0–$50/month** using free tiers of Supabase, Upstash, and Sentry.

---

## Frontend

| Category | Technology | Rationale |
|---|---|---|
| Framework | React + Vite | Fast HMR in dev; outputs optimized static files served by Express |
| Routing | React Router v7 | File-based or config routing; pairs naturally with Vite |
| Language | TypeScript | Type safety across the entire codebase |
| Styling | Oxfmt + shadcn/ui | Opinionated formatting with accessible, headless UI primitives |
| Drag & Drop | dnd-kit | Accessible DnD for Kanban + bookmark reordering |
| Data Fetching | TanStack Query | Server-state caching, background refetching, optimistic updates |
| Forms | TanStack Form | Type-safe forms with first-class Zod integration |
| Keyboard Shortcuts | TanStack Hotkeys | Declarative hotkey bindings across the app |
| State Management | Zustand | Lightweight reactive store; consistent with the TanStack ecosystem |
| Validation | Zod | Shared schema validation between client and server |
| Icons | tabler | Consistent icon set, tree-shakeable |

---

## Backend

| Category | Technology | Rationale |
|---|---|---|
| Runtime | Bun | Faster than Node.js; built-in bundler, test runner, and package manager |
| Server | Express | Minimal, battle-tested HTTP server; serves API + static client files |
| Auth | Better Auth | Modern auth library with OAuth, Magic Link, and session management |
| ORM | Prisma | Type-safe database client with migrations |
| Email | Nodemailer | Handles magic link and transactional emails |
| Validation | Zod | Shared schemas with frontend; runtime request validation |
| validate env | t3-env | |

---

## Database & Storage

| Category | Technology | Rationale |
|---|---|---|
| Primary DB | PostgreSQL | Relational data with JSONB support; managed via Prisma migrations |
| Caching | Redis | Session caching, rate limiting, background job queues |
| Realtime | Supabase Realtime | Live collaboration updates via WebSockets without custom infra |
| File Storage | Supabase Storage | S3-compatible; cover images, thumbnails, user uploads |

---

## Infrastructure & Deployment

| Category | Technology | Rationale |
|---|---|---|
| Containerization | Docker | Server + client shipped as a single image; consistent across envs |
| Local Dev | Docker Compose | Spins up Express server, PostgreSQL, and Redis together locally |
| CI/CD | GitHub Actions | Automated tests, linting, Docker image builds, and deployments |
| Monitoring | Sentry | Error tracking and performance monitoring for both client and server |
| Package Manager | Bun | Replaces npm/pnpm; significantly faster installs and script runs |

---

## Browser Extension

| Category | Technology | Rationale |
|---|---|---|
| Framework | WXT (Web Extension Tools) | Build for Chrome, Firefox, and Safari from one codebase |
| Language | TypeScript + React | Shared types and components with the main app |
| Auth Sync | Cookie / Token passthrough | Reuses existing Better Auth session from the web app |

---

## Premium & Payments

| Category | Technology | Rationale |
|---|---|---|
| Payments | Stripe | Subscription billing, customer portal, and webhooks |
| Feature Gating | Middleware + DB flags | Server-side premium checks on Express routes via Prisma |

---

## Testing & Quality

| Category | Technology | Rationale |
|---|---|---|
| Unit / Integration | Vitest | Fast, Vite-native test runner; works seamlessly with Bun |
| E2E | Playwright | Full browser testing for critical flows (auth, saving, sharing) |
| Linting | ESLint + Prettier | Consistent code style; enforced via pre-commit hooks |
| Schema Validation | Zod | Runtime safety at API boundaries; single source of truth |
