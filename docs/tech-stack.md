# Bookmark App — Technology Stack

**Full-Stack Framework**

- Next.js 15 (App Router + TypeScript)
- React 19

**UI Libraries & Components**

- base ui
- tabler icons
- dnd-kit
- Tailwind CSS
- WXT (Web Extension Tools)

**State & Data Management**

- Zustand
- TanStack Query
- TanStack Hotkeys

**Schema & Validation**

- Zod

**Authentication**

- NextAuth.js v5 (Auth.js)
- @auth/prisma-adapter

**Database & ORM**

- Prisma
- PostgreSQL

**Backend Services**

- Redis (caching & sessions)
- Nodemailer (email)
- Supabase Realtime (optional)
- Supabase Storage (optional)

**Next.js Middleware & Security**

- Next.js Middleware (rate limiting, auth checks)
- Security headers via `next.config.js`

**Observability & Logging**

- Sentry
- winston

**API & Documentation**

- OpenAPI / Swagger

**Environment & Config**

- t3-env

**Code Quality & Tooling**

- biome

**DevOps & Deployment**

- Docker / Docker Compose
- GitHub Actions
- Makefiles

### Project Initialization Checklist

This is a todo list for initializing a **Next.js full-stack app** with TypeScript, Prisma, and Next.js built-in authentication.

#### 1. Project & Repository Setup

- [ ] Initialize Next.js project with TypeScript
  - [ ] Run `npx create-next-app@latest` with TypeScript, App Router, Tailwind CSS
  - [ ] Configure project name and options
- [ ] Initialize Git repository
  - [ ] Run `git init` (if not already initialized)
  - [ ] Create `.gitignore` (ensure `.env*`, `node_modules`, `.next` are ignored)
  - [ ] Create initial commit
- [ ] Set up repository structure
  - [ ] Create `/src` folder for application code
  - [ ] Create `/prisma` folder for database schema
  - [ ] Create `/public` folder for static assets
  - [ ] Create `/docs` folder for documentation

#### 2. Code Quality & Tooling

- [ ] Install and configure **Biome**
  - [ ] Run `npm install --save-dev @biomejs/biome`
  - [ ] Run `npx biome init`
  - [ ] Configure `biome.json` for linting and formatting
  - [ ] Add scripts to `package.json` (`lint`, `format`, `check`)
- [ ] Set up Git hooks (optional)
  - [ ] Install `husky` for pre-commit hooks
  - [ ] Configure lint-staged

#### 3. Environment Variables & Configuration

- [ ] Install **t3-env** for type-safe environment variables
  - [ ] Run `npm install @t3-oss/env-nextjs zod`
  - [ ] Create `src/env.js` or `src/env.ts` with schema
  - [ ] Define client and server env variables
- [ ] Create environment files
  - [ ] Create `.env.local` for local development
  - [ ] Create `.env.example` template
  - [ ] Document required environment variables

#### 4. UI Libraries & Components

- [ ] Install **Base UI** components
  - [ ] Run `npm install @base-ui-components/react`
- [ ] Install **Tabler Icons**
  - [ ] Run `npm install @tabler/icons-react`
- [ ] Configure Tailwind CSS (if not already configured)
  - [ ] Verify `tailwind.config.ts` is set up
  - [ ] Add custom theme/colors if needed

#### 5. State Management & Data Fetching

- [ ] Install **Zustand** for client state
  - [ ] Run `npm install zustand`
  - [ ] Create store structure in `src/stores`
- [ ] Install **TanStack Query** for server state
  - [ ] Run `npm install @tanstack/react-query`
  - [ ] Set up QueryClientProvider in layout/provider
- [ ] Install **TanStack Hotkeys**
  - [ ] Run `npm install @tanstack/react-hotkeys`
- [ ] Install **Zod** for validation
  - [ ] Run `npm install zod`

#### 6. Database Setup (Prisma + PostgreSQL)

- [ ] Set up **PostgreSQL**
  - [ ] Install locally or set up cloud instance (Supabase/Neon/etc.)
  - [ ] Get connection string
- [ ] Install **Prisma**
  - [ ] Run `npm install prisma @prisma/client`
  - [ ] Run `npx prisma init`
  - [ ] Configure `DATABASE_URL` in `.env.local`
- [ ] Configure Prisma schema
  - [ ] Define initial models in `prisma/schema.prisma`
  - [ ] Run `npx prisma generate`
  - [ ] Run `npx prisma db push` or `npx prisma migrate dev`
- [ ] Set up Prisma Client singleton
  - [ ] Create `src/lib/prisma.ts` with global client instance

#### 7. Authentication (Next.js Auth)

- [ ] Install **NextAuth.js** (Auth.js v5)
  - [ ] Run `npm install next-auth@beta`
  - [ ] Create `auth.ts` configuration file
  - [ ] Configure Prisma adapter for NextAuth
  - [ ] Run `npm install @auth/prisma-adapter`
- [ ] Configure auth providers
  - [ ] Set up credentials provider or OAuth (Google, GitHub, etc.)
  - [ ] Add auth environment variables (SECRET, provider keys)
- [ ] Create auth API route
  - [ ] Create `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Add auth utilities
  - [ ] Create `src/lib/auth.ts` with helper functions
  - [ ] Set up session management and middleware

#### 8. Redis (Caching & Sessions)

- [ ] Install **Redis** client
  - [ ] Run `npm install ioredis`
  - [ ] Set up local Redis or cloud instance (Upstash)
- [ ] Configure Redis connection
  - [ ] Create `src/lib/redis.ts` with client setup
  - [ ] Add `REDIS_URL` to environment variables

#### 9. Email & Notifications

- [ ] Install **Nodemailer**
  - [ ] Run `npm install nodemailer`
  - [ ] Run `npm install --save-dev @types/nodemailer`
  - [ ] Create `src/lib/email.ts` with email service
  - [ ] Configure SMTP credentials in environment

#### 10. Logging & Monitoring

- [ ] Install **Winston** for structured logging
  - [ ] Run `npm install winston`
  - [ ] Create `src/lib/logger.ts` with log configuration
  - [ ] Set up log levels and transports
- [ ] Install **Sentry** for error tracking
  - [ ] Run `npx @sentry/wizard@latest -i nextjs`
  - [ ] Configure Sentry DSN in environment
  - [ ] Test error capturing

#### 11. Supabase Integration (Optional)

- [ ] Install **Supabase** client
  - [ ] Run `npm install @supabase/supabase-js`
  - [ ] Configure Supabase URL and anon key
- [ ] Configure **Supabase Realtime**
  - [ ] Set up realtime subscriptions for live updates
- [ ] Configure **Supabase Storage**
  - [ ] Set up file upload handlers
  - [ ] Create storage buckets

#### 12. API Documentation

- [ ] Set up **OpenAPI** documentation
  - [ ] Choose approach (next-swagger-doc or manual setup)
  - [ ] Document API routes with JSDoc or decorators
  - [ ] Create `/api-docs` route for Swagger UI

#### 13. Advanced Features

- [ ] Install **dnd-kit** for drag & drop
  - [ ] Run `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [ ] Set up **WXT** (if building browser extension)
  - [ ] Run `npm install wxt`
  - [ ] Configure `wxt.config.ts`

#### 14. DevOps & Deployment

- [ ] Create **Docker** configuration
  - [ ] Write `Dockerfile` for Next.js app
  - [ ] Write `docker-compose.yml` (PostgreSQL, Redis, app)
  - [ ] Create `.dockerignore`
- [ ] Set up **GitHub Actions**
  - [ ] Create `.github/workflows/ci.yml` (lint, type-check, build)
  - [ ] Create `.github/workflows/deploy.yml` (deployment pipeline)
- [ ] Create **Makefile** for common commands
  - [ ] Add commands: `dev`, `build`, `test`, `docker-up`, etc.

#### 15. Testing Setup (Optional)

- [ ] Install testing framework
  - [ ] Run `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom`
  - [ ] Configure `vitest.config.ts`
- [ ] Install E2E testing (optional)
  - [ ] Run `npm install --save-dev playwright`
  - [ ] Run `npx playwright install`

#### Milestone Goals

- **Phase 1**: Get Next.js app rendering in browser with basic routing
- **Phase 2**: Connect to database and set up Prisma models
- **Phase 3**: Implement authentication and protected routes
- **Phase 4**: Add core features and polish UI/UX
- **Phase 5**: Set up monitoring, logging, and deployment pipeline
