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
