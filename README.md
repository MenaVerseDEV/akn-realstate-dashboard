 # AKN Real Estate — CMS Dashboard

CMS for the **AKN Real Estate** website (أكن العقارية). It lets the site owner edit every
section of the public marketing site (Hero, About, Projects, Aspirations, Video, Values,
Features, Partners, Contact, Navigation, Footer, Site Settings) without touching code.

This repo is intentionally **separate** from the public site repo (`akn-realstate-frontend`).
It contains the **Node.js (NestJS) backend API** and the **admin dashboard** that talk to it.

> Status: **admin dashboard UI** is runnable with mock data. Backend API integration is planned.

## Admin dashboard (frontend)

The Next.js admin UI lives at the **repo root**. It calls the Heroku API directly via `authFetch` (see `NEXT_PUBLIC_API_URL`).

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

### Modules

Site Settings · Navigation · Hero (+ Stats) · About (+ Cards) · Projects (+ Media gallery)
· Milestones · Video · Values · Features · Partners · Contact · Footer (+ Services, Socials)

## What's here

| Doc | Purpose |
|-----|---------|
| [`docs/SCHEMA.md`](docs/SCHEMA.md) | Data model — modules, entities, ER diagram, Prisma schema |
| [`docs/ENDPOINTS.md`](docs/ENDPOINTS.md) | Full REST API contract (auth, public reads, admin CRUD, media) |
| [`docs/FRONTEND_PROMPT.md`](docs/FRONTEND_PROMPT.md) | Ready-to-use prompt to build the admin dashboard UI in the project's style |

## Architecture

```
akn-realstate-frontend (public site)  ──GET /api/public/site──►  ┐
                                                                  │
akn-realstate-dashboard (admin UI)    ──login + CRUD (JWT)─────►  ├─ NestJS REST API ─► PostgreSQL
                                                                  │                   ─► Media storage (disk/S3)
                                       ──multipart upload────►    ┘
```

- **Backend**: Node.js + NestJS + Prisma + PostgreSQL. JWT auth. Media upload to disk (dev) / S3 (prod).
- **Admin UI**: Next.js 16 + shadcn/Radix + Tailwind v4, matching the public site's design system
  (Cairo font, RTL, brand palette, 0px radius). Can be hosted here or as a route group in the site repo.
- **Content**: every editable text field is stored as localized JSON `{ "ar": "...", "en": "..." }`
  (next-intl is already configured for `ar`/`en` on the site; EN is optional for now).

## Backend modules

Auth & Users · Site Settings · Navigation · Hero (+ Stats) · About (+ Cards) · Projects (+ Media)
· Milestones · Video Showcase · Values · Features · Partners · Contact/CTA · Footer (+ Services, Social Links)
· Media Library.

See [`docs/SCHEMA.md`](docs/SCHEMA.md) for the full entity model.

## Getting started

### Admin dashboard (available now)

```bash
cp .env.example .env
npm install
npm run dev                    # http://localhost:3000
```

### Backend (planned)

```bash
# backend
cd api
cp .env.example .env          # set DATABASE_URL, JWT_SECRET, etc.
npm install
npx prisma migrate dev
npm run seed                   # imports current content from the site's lib/data.ts
npm run start:dev              # http://localhost:4000
```

## Conventions

- Localized fields: `{ ar, en }`. Always provide `ar`; `en` optional.
- Ordered collections expose a `PATCH .../reorder` endpoint and an `order` integer.
- "Singleton" sections (Hero, About, Contact, Footer, Site Settings, Video) have exactly one record
  and are edited via `PUT` (no create/delete).
- All admin endpoints require `Authorization: Bearer <jwt>`. Public read endpoints are unauthenticated.
