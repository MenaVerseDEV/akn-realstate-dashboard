# REST API Contract

Base URL: `http://localhost:4000/api` (dev). All responses are JSON.

## Conventions

- **Auth**: admin endpoints require `Authorization: Bearer <accessToken>`. Public endpoints are open.
- **Localized fields** are objects: `{ "ar": "نص", "en": "text" }`. `ar` required, `en` optional.
- **Errors** use a consistent shape:

```json
{ "statusCode": 400, "message": "Validation failed", "errors": { "title.ar": "required" } }
```

- **Ordered collections** accept `PATCH /:module/reorder` with `{ "ids": ["id1","id2","id3"] }`.
- **Pagination** (where lists can grow, e.g. media): `?page=1&pageSize=20` → `{ data, total, page, pageSize }`.
- **Timestamps**: `createdAt` / `updatedAt` returned on every record.

---

## 1. Auth

| Method | Path | Auth | Body | Returns |
|--------|------|------|------|---------|
| POST | `/auth/login` | — | `{ email, password }` | `{ accessToken, refreshToken, user }` |
| POST | `/auth/refresh` | — | `{ refreshToken }` | `{ accessToken }` |
| POST | `/auth/logout` | Bearer | — | `204` |
| GET | `/auth/me` | Bearer | — | `{ id, email, role }` |

```http
POST /api/auth/login
{ "email": "owner@akn.sa", "password": "••••••••" }

200 OK
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "u_1", "email": "owner@akn.sa", "role": "admin" }
}
```

---

## 2. Public reads (consumed by the website)

Unauthenticated. These power the public site.

| Method | Path | Returns |
|--------|------|---------|
| GET | `/public/site` | **Aggregate**: all sections in one payload (preferred for the homepage) |
| GET | `/public/settings` | Site settings |
| GET | `/public/nav` | Visible nav links, ordered |
| GET | `/public/hero` | Hero + stats |
| GET | `/public/about` | About + cards |
| GET | `/public/projects` | Published projects + media, ordered |
| GET | `/public/projects/:slug` | Single project + media |
| GET | `/public/milestones` | Ordered |
| GET | `/public/video` | Video showcase |
| GET | `/public/values` | Ordered |
| GET | `/public/features` | Ordered |
| GET | `/public/partners` | Ordered |
| GET | `/public/contact` | Contact/CTA |
| GET | `/public/footer` | Footer + services + socials |

```http
GET /api/public/site

200 OK
{
  "settings": { "siteName": { "ar": "أكن العقارية", "en": "AKN Real Estate" }, "logoUrl": "/uploads/logo.png", "defaultLocale": "ar" },
  "nav": [ { "id": "n1", "label": { "ar": "الرئيسية" }, "href": "#hero", "order": 0 } ],
  "hero": {
    "badge": { "ar": "مرفق عقاري معتمد ومسجل" },
    "title": { "ar": "نصنع للمستقبل مفاهيم سكنية تليق بتطلعاتك" },
    "description": { "ar": "نفخر في أكن العقارية..." },
    "primaryCtaLabel": "اكتشف عالمنا", "primaryCtaHref": "#about",
    "secondaryCtaLabel": "تواصل معنا", "secondaryCtaHref": "#contact",
    "stats": [ { "value": 500, "suffix": "+", "label": { "ar": "وحدة سكنية منجزة" }, "icon": "solar:home-smile-bold" } ]
  },
  "about": { "...": "..." },
  "projects": [ { "slug": "101", "name": { "ar": "مشروع أكن 101" }, "media": [] } ],
  "milestones": [], "video": {}, "values": [], "features": [], "partners": [],
  "contact": {}, "footer": {}
}
```

---

## 3. Admin — Singletons

Edited with `GET` + `PUT` (exactly one record, no create/delete).

| Module | GET | PUT |
|--------|-----|-----|
| Site Settings | `/website-settings` | `/website-settings` (multipart) |
| Hero | `/admin/hero` | `/admin/hero` |
| About | `/admin/about` | `/admin/about` |
| Video Showcase | `/admin/video` | `/admin/video` |
| Contact / CTA | `/admin/contact` | `/admin/contact` |
| Footer | `/admin/footer` | `/admin/footer` |

```http
PUT /api/admin/hero
Authorization: Bearer <jwt>
{
  "badge": { "ar": "مرفق عقاري معتمد ومسجل", "en": "Certified real estate" },
  "title": { "ar": "نصنع للمستقبل مفاهيم سكنية تليق بتطلعاتك" },
  "description": { "ar": "..." },
  "primaryCtaLabel": "اكتشف عالمنا",
  "primaryCtaHref": "#about",
  "secondaryCtaLabel": "تواصل معنا",
  "secondaryCtaHref": "#contact",
  "backgroundMediaUrl": null
}

200 OK  // returns updated hero
```

> Nested collections of a singleton (Hero stats, About cards, Footer services & socials) can be
> sent inline in the singleton `PUT` (full replace), or managed individually via the sub-routes below.

### Website settings (real API)

Production path: `GET/PUT /api/v1/website-settings` (Bearer required).

`defaultLanguage` enum: `en` | `ar`.

```http
GET /api/v1/website-settings
Authorization: Bearer <jwt>

200 OK
{
  "success": true,
  "data": {
    "websiteName": { "ar": "أكن", "en": "AKN" },
    "defaultLanguage": "ar",
    "logoUrl": "https://..."
  }
}
```

```http
PUT /api/v1/website-settings
Authorization: Bearer <jwt>
Content-Type: multipart/form-data

websiteName={"ar":"أكن","en":"AKN"}
defaultLanguage=ar
logo=@logo.webp;type=image/webp
```

The dashboard proxies these via `GET/PUT /api/website-settings` (Next.js BFF).

### Navigation bar pages (real API)

Production path: `/api/v1/nav-bar-pages` (Bearer required).

| Method | Path | Body |
|--------|------|------|
| GET | `/nav-bar-pages` | — (list; `title` localized via `Accept-Language`) |
| POST | `/nav-bar-pages` | `{ title: { ar, en }, link, isActive }` |
| GET | `/nav-bar-pages/:id` | — |
| PUT | `/nav-bar-pages/:id` | `{ title, link, isActive }` |
| DELETE | `/nav-bar-pages/:id` | — |
| PUT | `/nav-bar-pages/reorder` | `{ ids: string[] }` |

Field mapping in dashboard: `title→label`, `link→href`, `isActive→visible`.

The BFF merges bilingual titles on list by fetching with `Accept-Language: ar` and `en`.

Dashboard proxy routes: `/api/nav-bar-pages`, `/api/nav-bar-pages/[id]`, `/api/nav-bar-pages/reorder`.

### Footer info (real API)

Production path: `GET/PUT /api/v1/footer/info` (Bearer required).

```http
GET /api/v1/footer/info

200 OK
{
  "success": true,
  "data": {
    "websiteName": { "ar": "أكن", "en": "akn" },
    "websiteDescription": { "ar": "...", "en": "..." },
    "address": { "ar": "...", "en": "..." },
    "logoUrl": null,
    "phone": "",
    "email": "info@example.com"
  }
}
```

```http
PUT /api/v1/footer/info
Content-Type: multipart/form-data

websiteName={"ar":"أكن","en":"akn"}
websiteDescription={"ar":"...","en":"..."}
address={"ar":"...","en":"..."}
logo=@logo.webp
phone=+201000000000
email=info@example.com
```

Field mapping: `websiteName→companyName`, `websiteDescription→description`, `logo→logoFile`.

Dashboard proxy: `GET/PUT /api/footer/info`.

### Footer services (real API, client + RTK)

Production path: `/api/v1/footer/services` (Bearer required). Called **directly from the browser** via `authFetch` + RTK Query — no Next.js BFF routes.

```http
GET /api/v1/footer/services
Accept-Language: ar | en

200 OK
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Consulting",
      "link": "/services/consulting",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

```http
PATCH /api/v1/footer/services/:id
Content-Type: application/json

{
  "title": { "en": "Consulting", "ar": "استشارات" },
  "link": "/services/consulting"
}
```

Also: `POST /footer/services`, `DELETE /footer/services/:id`, `PUT /footer/services/reorder` with `{ ids: string[] }`.

Field mapping: `title` merged from dual `Accept-Language` fetches; `link` stored as-is. List `order` is derived from array index.

RTK: `useFooterServices()` → `listFooterServices` tag `FooterServices`.

### Footer social media links (real API, client + RTK)

Production path: `/api/v1/footer/social-media-links` (Bearer required). Called **directly from the browser** via `authFetch` + RTK Query — no Next.js BFF routes.

```http
GET /api/v1/footer/social-media-links

200 OK
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "platformName": "Facebook",
      "icon": "facebook",
      "link": "https://facebook.com/example",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

```http
POST /api/v1/footer/social-media-links
Content-Type: application/json

{
  "platformName": "Facebook",
  "icon": "facebook",
  "link": "https://facebook.com/example"
}
```

Also: `GET/PATCH/DELETE /footer/social-media-links/:id`, `PUT /footer/social-media-links/reorder` with `{ ids: string[] }`.

Field mapping: `platformName→platform`, `link→url`, `icon` slug → iconify display (`facebook` → `solar:facebook-bold`). List `order` derived from array index.

RTK: `useFooterSocialLinks()` → tag `FooterSocialLinks`.

### Home hero section (real API, direct client + RTK)

Production path: `GET/PUT /api/v1/home/hero-section` (Bearer required). Called **directly from the browser** via `authFetch` + RTK Query — no Next.js BFF routes.

```http
GET /api/v1/home/hero-section

200 OK
{
  "success": true,
  "data": {
    "subtitle": { "ar": "...", "en": "..." },
    "title": { "ar": "...", "en": "..." },
    "description": { "ar": "...", "en": "..." },
    "backgroundImageUrl": "https://...",
    "primaryButtonLabel": { "ar": "...", "en": "..." },
    "primaryButtonLink": "#about",
    "secondaryButtonLabel": { "ar": "...", "en": "..." },
    "secondaryButtonLink": "#contact",
    "analysis": [
      {
        "order": 1,
        "icon": "users",
        "value": "120+",
        "label": { "ar": "عميل", "en": "Clients" }
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

```http
PUT /api/v1/home/hero-section
Content-Type: multipart/form-data

subtitle={"ar":"...","en":"..."}
title={"ar":"...","en":"..."}
description={"ar":"...","en":"..."}
primaryButtonLabel={"ar":"...","en":"..."}
secondaryButtonLabel={"ar":"...","en":"..."}
primaryButtonLink=#about
secondaryButtonLink=#contact
analysis=[{"order":1,"icon":"users","value":"120+","label":{"ar":"عميل"}}]
backgroundImage=@hero-bg.webp
```

Field mapping:

| API | Dashboard |
|-----|-----------|
| `subtitle` | `badge` |
| `backgroundImage` / `backgroundImageUrl` | `backgroundMediaUrl` + `backgroundImageFile` |
| `primaryButtonLabel`, `primaryButtonLink` | `primaryCtaLabel`, `primaryCtaHref` |
| `secondaryButtonLabel`, `secondaryButtonLink` | `secondaryCtaLabel`, `secondaryCtaHref` |
| `analysis[]` | `stats[]` — `value` string split into `value` + `suffix`; `icon` slug ↔ iconify |

RTK: `useHero()` / `useUpdateHero()` → tag `Hero`. Client: [`lib/api/hero.ts`](lib/api/hero.ts).

### Home about us section (real API, direct client + RTK)

Production path: `GET/PUT /api/v1/home/about-us-section` (Bearer required). Called **directly from the browser** via `authFetch` + RTK Query — no Next.js BFF routes.

```http
GET /api/v1/home/about-us-section

200 OK
{
  "success": true,
  "data": {
    "subtitle": { "ar": "من نحن", "en": "About us" },
    "title": { "ar": "...", "en": "..." },
    "description": { "ar": "...", "en": "..." },
    "imageUrl": null,
    "cards": [
      {
        "order": 1,
        "icon": "target",
        "title": { "ar": "تنفيذ مركز", "en": "Focused execution" }
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

```http
PUT /api/v1/home/about-us-section
Content-Type: multipart/form-data

subtitle={"ar":"من نحن","en":"About us"}
title={"ar":"...","en":"..."}
description={"ar":"...","en":"..."}
cards=[{"order":1,"icon":"target","title":{"ar":"تنفيذ مركز","en":"Focused execution"}}]
image=@about.webp
```

Field mapping:

| API | Dashboard |
|-----|-----------|
| `subtitle` | `eyebrow` |
| `image` / `imageUrl` / `imagePath` | `imageUrl` + `imageFile` |
| `cards[]` | `cards[]` — `icon` slug ↔ iconify; cards have `title` only (no `description`) |

RTK: `useAbout()` / `useUpdateAbout()` → tag `About`. Client: [`lib/api/about.ts`](lib/api/about.ts).

### Home aspirations (real API, direct client + RTK)

Production path: `/api/v1/home/aspirations` (Bearer required). Called **directly from the browser** via `authFetch` + RTK Query — no Next.js BFF routes.

| Method | Path | Body |
|--------|------|------|
| GET | `/home/aspirations` | — (`Accept-Language: ar` / `en`) |
| GET | `/home/aspirations/:id` | — (dual-language for edit hydration) |
| POST | `/home/aspirations` | `{ year, order?, title, description, icon }` |
| PATCH | `/home/aspirations/:id` | same fields |
| DELETE | `/home/aspirations/:id` | — |
| PUT | `/home/aspirations/reorder` | `{ ids: string[] }` |

List responses return flat `title` / `description` strings per `Accept-Language`. POST/PATCH accept full `{ ar, en }` objects. Dashboard merges ar + en fetches (same pattern as footer services).

Field mapping: API `year` (number) ↔ dashboard `Milestone.year` (string in form). `icon` is stored as full iconify string (e.g. `solar:flag-bold-duotone`).

RTK: `useMilestones()` / `useGetMilestoneByIdQuery` → tag `Milestones`. Client: [`lib/api/aspirations.ts`](lib/api/aspirations.ts). Admin UI: `/admin/milestones`.

### Projects (real API, direct client + RTK)

Production path: `/api/v1/projects` (Bearer required). Called **directly from the browser** via `authFetch` + RTK Query — no Next.js BFF routes.

| Method | Path | Notes |
|--------|------|-------|
| GET | `/projects?page&limit&search&status&isPublished` | Paginated list; dual `Accept-Language` merge |
| GET | `/projects/:id` | Single project (dual-language for edit) |
| GET | `/projects/slug/:slug` | Lookup by slug |
| POST | `/projects` | Create |
| PATCH | `/projects/:id` | Update |
| DELETE | `/projects/:id` | Delete |

List response: `{ items: [...], meta: { total, page, limit, totalPages, hasNext, hasPrev } }`. Omit `status` query param when fetching all statuses.

Field mapping: `isPublished` ↔ `published`. Status enum: `planning` | `in_progress` | `completed` | `in_hold`.

RTK: `useProjects(params)` / `useProject(id)` → tags `Projects` / `Project`. Client: [`lib/api/projects.ts`](lib/api/projects.ts). Admin UI: `/admin/projects`.

Project media gallery (`/admin/projects/[id]`) remains on mock until media API is wired.

### Singleton sub-collections

| Path | Methods |
|------|---------|
| `/admin/hero/stats` , `/admin/hero/stats/:id` | `POST` / `PUT` / `DELETE` , `PATCH /admin/hero/stats/reorder` |
| `/admin/about/cards` , `/admin/about/cards/:id` | `POST` / `PUT` / `DELETE` , `reorder` |
| `/admin/footer/services` , `/admin/footer/services/:id` | `POST` / `PUT` / `DELETE` , `reorder` |
| `/admin/footer/socials` , `/admin/footer/socials/:id` | `POST` / `PUT` / `DELETE` , `reorder` |

---

## 4. Admin — Collections

Standard CRUD + reorder for each. Replace `:module` with the slug below.

| Module | Base path |
|--------|-----------|
| Navigation | `/admin/nav` |
| Projects | `/admin/projects` |
| Milestones | `/admin/milestones` |
| Values | `/admin/values` |
| Features | `/admin/features` |
| Partners | `/admin/partners` |

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/admin/:module` | — | `[ ...records ]` ordered |
| GET | `/admin/:module/:id` | — | record |
| POST | `/admin/:module` | record (no id) | created record `201` |
| PUT | `/admin/:module/:id` | full record | updated record |
| PATCH | `/admin/:module/:id` | partial | updated record |
| DELETE | `/admin/:module/:id` | — | `204` |
| PATCH | `/admin/:module/reorder` | `{ "ids": ["id1","id2"] }` | ordered list |

```http
POST /api/admin/features
Authorization: Bearer <jwt>
{
  "title": { "ar": "جودة البناء", "en": "Build quality" },
  "description": { "ar": "نستخدم أجود المواد..." },
  "icon": "solar:shield-check-bold"
}

201 Created
{ "id": "f_7", "title": { "ar": "جودة البناء" }, "icon": "solar:shield-check-bold", "order": 6 }
```

### Projects + media (nested)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/admin/projects` | list (incl. media counts) |
| POST | `/admin/projects` | `{ slug, name, description, status, published }` |
| PUT | `/admin/projects/:id` | update project fields |
| DELETE | `/admin/projects/:id` | cascades to media |
| GET | `/admin/projects/:id/media` | list media |
| POST | `/admin/projects/:id/media` | `{ url, type, caption }` (url from Media Library) |
| PUT | `/admin/projects/:id/media/:mediaId` | update caption/type |
| DELETE | `/admin/projects/:id/media/:mediaId` | remove from gallery |
| PATCH | `/admin/projects/:id/media/reorder` | `{ "ids": [...] }` |

---

## 5. Admin — Media Library

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/admin/media?page=1&pageSize=20&type=image` | — | `{ data, total, page, pageSize }` |
| POST | `/admin/media` | `multipart/form-data` field `file` (+ optional `altText`) | created `MediaAsset` |
| GET | `/admin/media/:id` | — | `MediaAsset` |
| PATCH | `/admin/media/:id` | `{ altText }` | updated |
| DELETE | `/admin/media/:id` | — | `204` (blocked `409` if still referenced) |

```http
POST /api/admin/media
Authorization: Bearer <jwt>
Content-Type: multipart/form-data
file=<binary>; altText="واجهة مشروع 101"

201 Created
{ "id": "m_12", "url": "/uploads/akn-101-front.jpg", "type": "image", "width": 1920, "height": 1080, "size": 384210 }
```

---

## Status codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No content (delete / logout) |
| 400 | Validation error |
| 401 | Missing/invalid token |
| 403 | Authenticated but not allowed |
| 404 | Not found |
| 409 | Conflict (e.g. duplicate slug, media still referenced) |

## Summary of all routes

```
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/public/site
GET    /api/public/{settings|nav|hero|about|projects|milestones|video|values|features|partners|contact|footer}
GET    /api/public/projects/:slug

GET    /api/admin/settings            PUT /api/admin/settings
GET    /api/admin/hero                PUT /api/admin/hero
GET    /api/admin/about               PUT /api/admin/about
GET    /api/admin/video               PUT /api/admin/video
GET    /api/admin/contact             PUT /api/admin/contact
GET    /api/admin/footer              PUT /api/admin/footer

(POST|PUT|DELETE) /api/admin/hero/stats[/:id]        PATCH /api/admin/hero/stats/reorder
(POST|PUT|DELETE) /api/admin/about/cards[/:id]       PATCH /api/admin/about/cards/reorder
(POST|PUT|DELETE) /api/admin/footer/services[/:id]   PATCH /api/admin/footer/services/reorder
(POST|PUT|DELETE) /api/admin/footer/socials[/:id]    PATCH /api/admin/footer/socials/reorder

GET|POST|PUT|PATCH|DELETE /api/admin/{nav|projects|milestones|values|features|partners}[/:id]
PATCH  /api/admin/{...}/reorder

GET|POST|PUT|DELETE /api/admin/projects/:id/media[/:mediaId]
PATCH  /api/admin/projects/:id/media/reorder

GET|POST /api/admin/media
GET|PATCH|DELETE /api/admin/media/:id
```
