<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## API architecture

This dashboard talks to a **remote Heroku backend** (`NEXT_PUBLIC_API_URL`). Do **not** add Next.js BFF proxy routes (`app/api/**/route.ts`) for CMS or content APIs.

### Call the backend directly from the browser

- Use `authFetch` + `apiUrl` from [`lib/api/fetch-auth.ts`](lib/api/fetch-auth.ts) and [`lib/api/parse-response.ts`](lib/api/parse-response.ts).
- Map responses in [`lib/api/mappers/`](lib/api/mappers/).
- Wire RTK Query in [`lib/store/api/`](lib/store/api/) to thin clients in [`lib/api/`](lib/api/).

Reference implementations: [`lib/api/footer-services.ts`](lib/api/footer-services.ts), [`lib/api/hero.ts`](lib/api/hero.ts), [`lib/api/about.ts`](lib/api/about.ts).

Multipart PUT (file uploads) works the same way — build `FormData` in the mapper and `PUT` via `authFetch`; no server proxy needed.

### When `app/api/*` routes ARE allowed

Only for **auth session** concerns that must run on the server:

- `app/api/auth/login`, `logout`, `refresh`, `me`

Do **not** create `app/api/home/*`, `app/api/footer/*`, `app/api/website-settings`, etc. to proxy Heroku. The backend already exists; call it directly.

