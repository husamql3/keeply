# Bookmark App — Technology Stack

**Frontend / React Core**  

- React + Vite  
- React Router v7  
- base ui  
- tabler  
- dnd-kit  
- WXT (Web Extension Tools)  

**State & Data Management**  

- Zustand  
- TanStack Query  
- TanStack Hotkeys  

**Schema & Validation**  

- Zod  

**Backend / Server**  

- express  
- Better Auth  
- Prisma  
- Nodemailer  
- PostgreSQL  
- Redis  
- Supabase Realtime  
- Supabase Storage  

**Backend Security & Middleware**  

- helmet  
- express-rate-limit  
- compression  
- express-async-errors  
- express-validator  
- jsonwebtoken + bcryptjs  

**Observability & Logging**  

- Sentry  
- winston  

**API & Documentation**  

- open api  

**Environment & Config**  

- t3-env  

**Code Quality & Tooling**  

- biome  

**DevOps & Deployment**  

- Docker / Docker Compose  
- GitHub Actions  

### Simple Roadmap / To-Do List – Suggested Order

This is a pragmatic sequence for a **Vite + React frontend + Express + Prisma backend** app (monorepo or separate folders). Adjust slightly if using a monorepo structure.

1. Initialize project structure  
   - Create folders (e.g. `/frontend`, `/backend` or monorepo root)  
   - `npm create vite@latest` (frontend) → React + TS  
   - `npm init -y` (backend) → add `"type": "module"` in package.json  

2. Frontend basics  
   - Install & configure **React + Vite** (already from create-vite)  
   - Add **React Router v7** → set up basic routes/layout  
   - Install **base ui** + **tabler** (UI/components)  
   - Add **biome** (lint/format) → configure and run init  

3. State & data frontend  
   - Install **Zustand** → global/light state stores  
   - Install **TanStack Query** → data fetching + cache  
   - Install **TanStack Hotkeys** → keyboard shortcuts  
   - Install **Zod** → schema/validation (forms, API responses)  

4. Backend basics  
   - Install **express**  
   - Add **helmet**, **compression**, **express-rate-limit** (early security/performance)  
   - Add body parsers: `express.json()` + `express.urlencoded()`  
   - Install **express-async-errors** → global async error support  

5. Environment & config  
   - Install **t3-env** → type-safe env variables (use in both FE/BE)  

6. Database & ORM  
   - Set up **PostgreSQL** (local or cloud)  
   - Install **Prisma** → init, schema.prisma, generate client  
   - (Optional early) **Redis** → install + basic client connection  

7. Authentication  
   - Install **Better Auth** → configure adapter (Prisma), providers  
   - Install **jsonwebtoken + bcryptjs** (if you extend/customize auth)  
   - Mount Better Auth handler (e.g. `/api/auth/*`)  

8. Extra backend middleware & utils  
   - Install **express-validator** → input validation  
   - Install **Nodemailer** → email sending (verification, etc.)  
   - Install **winston** → structured logging  

9. Supabase extras (if using)  
   - Configure **Supabase Realtime** (client-side subscriptions)  
   - Configure **Supabase Storage** (file uploads)  

10. API Documentation  
    - Add **open api** (e.g. swagger-jsdoc + swagger-ui-express or tsoa)  

11. Error handling & observability  
    - Add global error middleware (after routes)  
    - Install & configure **Sentry** (both frontend + backend)  

12. Advanced frontend features  
    - Add **dnd-kit** → drag & drop  
    - (If building extension) Add **WXT** setup  

13. DevOps & production  
    - Dockerize (backend + optionally frontend) → write **Dockerfile** + **docker-compose.yml** (PostgreSQL, Redis, app)  
    - Set up **GitHub Actions** (CI: lint, build, test; CD: deploy)  

→ get something rendering in browser.  
→ get a working backend + auth + DB.  
→ polish backend.  
→ advanced + deploy.
